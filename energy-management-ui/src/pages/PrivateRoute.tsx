import {useDispatch, useSelector} from "react-redux";
import {AuthState, endSession, selectAuthState} from "../redux/slices";
import {Navigate, useLocation} from 'react-router-dom';
import {createContext, ReactNode, useEffect, useState} from "react";
import {AppRoutes} from "../utils/constants.ts";
import {Client, Message, over} from "stompjs";
import SockJS from "sockjs-client";
import {Notification, NotificationType, Response, Topic} from "@/models/transfer.ts";
import {toast} from "react-hot-toast";
import {errorToastOptions, infoToastOptions, successToastOptions} from "@/utils/toast.tsx";

export type WsContext = {
   client: Client | null;
   chatClient: Client | null;
};

const defaultWsContextValue = {client: null, chatClient: null};
export const WsContext = createContext<WsContext>(defaultWsContextValue);

type PrivateRouteProps = {
   children: ReactNode,
}

export default function PrivateRoute({children}: PrivateRouteProps) {
   const authState: AuthState = useSelector(selectAuthState);
   const location = useLocation();
   const dispatch = useDispatch();
   const [wsContext, setWsContext] = useState<WsContext>(defaultWsContextValue);

   useEffect(() => {
      if (authState.loggedIn && authState.user) {

         const stompClient: Client = over(new SockJS('/socket'));
         stompClient.connect({"Identity": authState.user.id}, frame => {
            console.log("WS Client connected: ", frame);

            stompClient.subscribe(Topic.NOTIFICATIONS, (message: Message) => {
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

         const chatStompClient: Client = over(new SockJS('/chatSocket'));
         chatStompClient.connect({"Identity": authState.user.id}, frame => {
            console.log("Chat WS Client connected: ", frame);
         });

         setWsContext({client: stompClient, chatClient: chatStompClient});
      } else if (!authState.loggedIn) {
         const {client, chatClient} = wsContext;

         if (client) {
            client.disconnect(() => console.log("WS Client disconnected."));
         }

         if (chatClient) {
            chatClient.disconnect(() => {
               console.log("Chat WS Client disconnected.")
            });
         }

         dispatch(endSession());
      }

      return () => {
      };
   }, [authState, dispatch]);

   return (
      <WsContext.Provider value={wsContext}>
         {authState.loggedIn ?
            <>{children}</> :
            <Navigate to={`${AppRoutes.LOGIN}?from=${location.pathname}${location.search}`} replace={true}/>
         }
      </WsContext.Provider>);
};