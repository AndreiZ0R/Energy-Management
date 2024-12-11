import {useDispatch, useSelector} from "react-redux";
import {AuthState, endSession, selectAuthState} from "@/redux/slices";
import {Navigate, useLocation} from 'react-router-dom';
import {ReactNode, useEffect} from "react";
import {AppRoutes, WebsocketPaths} from "../utils/constants.ts";
import {Message} from "stompjs";
import {ChatNotification, ChatNotificationType, MessageAcknowledgement, Notification, NotificationType, Response, Topic} from "@/models/transfer.ts";
import {toast} from "react-hot-toast";
import {errorToastOptions, infoToastOptions, successToastOptions} from "@/utils/toast.tsx";
import {pushMessage, selectSocketState, setLastReadMessage, setTypingMap, SocketState} from "@/redux/slices/socket-slice.ts";
import {ChatMessage} from "@/models/entities.ts";
import {isOnPath} from "@/utils/uriHelper.ts";

type PrivateRouteProps = {
   children: ReactNode,
}

export default function PrivateRoute({children}: PrivateRouteProps) {
   const authState: AuthState = useSelector(selectAuthState);
   const location = useLocation();
   const dispatch = useDispatch();

   const socketState: SocketState = useSelector(selectSocketState);

   useEffect(() => {
      if (authState.loggedIn && authState.user) {
         socketState.client.connect({"Identity": authState.user.id}, frame => {
            console.log("WS Client connected: ", frame);

            socketState.client.subscribe(Topic.NOTIFICATIONS, (message: Message) => {
               const notificationResponse: Response<Notification> = JSON.parse(message.body).body;
               const {message: notificationMessage, type, userId} = notificationResponse.payload;

               if (userId === authState.user?.id) {
                  switch (type) {
                     case NotificationType.INFO:
                        toast.success(notificationMessage, infoToastOptions());
                        break;
                     case NotificationType.SUCCESS:
                        toast.success(notificationMessage, successToastOptions());
                        break;
                     case NotificationType.ERROR:
                        toast.error(notificationMessage, errorToastOptions());
                        break;
                  }
               }
            })
         });

         socketState.chatClient.connect({"Identity": authState.user.id}, (frame) => {
            console.log("Chat WS Client connected: ", frame);

            socketState.chatClient.subscribe(`/user${Topic.CHAT}`, (message: Message) => {
               const chatMessageResponse: Response<ChatMessage> = JSON.parse(message.body).body;
               const {id: messageId, senderId, receiverId, message: content} = chatMessageResponse.payload;

               dispatch(pushMessage(chatMessageResponse.payload));

               // Todo: check if can move the users to redux as well and format the message
               if (!isOnPath(AppRoutes.CHATS) && receiverId === authState?.user?.id) {
                  toast.success(`New message: ${content}`, infoToastOptions());
               }

               if (isOnPath(AppRoutes.CHATS) && receiverId === authState?.user?.id) {
                  socketState.chatClient.send(WebsocketPaths.acknowledgeMessage, {}, JSON.stringify({
                     messageId: messageId,
                     acknowledgedBy: receiverId,
                     target: senderId
                  }));
               }
            });

            socketState.chatClient.subscribe(`/user${Topic.CHAT_NOTIFICATIONS}`, (message: Message) => {
               const notificationResponse: Response<ChatNotification> = JSON.parse(message.body).body;
               const {type, senderId} = notificationResponse.payload;

               dispatch(setTypingMap({
                  ...socketState.typingMap,
                  [senderId]: type === ChatNotificationType.START_TYPING,
               }));
            });

            socketState.chatClient.subscribe(`/user${Topic.ACK_MESSAGE}`, (message: Message) => {
               const ackResponse: Response<MessageAcknowledgement> = JSON.parse(message.body).body;
               const {messageId} = ackResponse.payload;

               dispatch(setLastReadMessage(messageId));
            });
         })
      } else if (!authState.loggedIn) {
         socketState.client.disconnect(() => console.log("WS Client disconnected"));
         socketState.chatClient.disconnect(() => console.log("Chat WS Client disconnected"));

         dispatch(endSession());
      }
   }, [authState.loggedIn, authState.user, dispatch, socketState.chatClient, socketState.client, socketState.typingMap]);

   return (
      authState.loggedIn ?
         <>{children}</> :
         <Navigate to={`${AppRoutes.LOGIN}?from=${location.pathname}${location.search}`} replace={true}/>
   );
};

