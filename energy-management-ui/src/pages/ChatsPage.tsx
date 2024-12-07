import {useContext, useEffect, useState} from "react";
import {ChatMessage, User} from "@/models/entities.ts";
import {ChatNotification, ChatNotificationType, Response, Topic} from "@/models/transfer.ts";
import {Message} from "stompjs";
import {infoToastOptions} from "@/utils/toast.tsx";
import {toast} from "react-hot-toast";
import {useGetAllUsersQuery, useLazyGetConversationQuery} from "@/redux/api.ts";
import ChatCard from "@/components/Card/ChatCard.tsx";
import {AuthState, selectAuthState, subscribe} from "@/redux/slices";
import {useDispatch, useSelector} from "react-redux";
import {WsContext} from "@/pages/PrivateRoute.tsx";
import ViewChat from "@/components/Chat/ViewChat.tsx";
import {WebsocketPaths} from "@/utils/constants.ts";

export default function ChatsPage() {
   const dispatch = useDispatch()
   const authState: AuthState = useSelector(selectAuthState);
   const {chatClient: wsClient} = useContext<WsContext>(WsContext);
   const {data: usersResponse} = useGetAllUsersQuery();
   const [selectedUser, setSelectedUser] = useState<User | null>(null);

   const [triggerGetConversation] = useLazyGetConversationQuery();
   const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

   const [typingMap, setTypingMap] = useState<Record<string, boolean>>({});

   const formatNotificationMessage = (chatMessage: ChatMessage): string => {
      const foundUser = usersResponse?.payload.find(user => user.id === chatMessage.senderId);
      if (foundUser) {
         return `${foundUser.username}: ${chatMessage.message}`
      }

      return "You have one new message";
   }

   const onChatMessageReceived = (message: Message) => {
      const chatMessageResponse: Response<ChatMessage> = JSON.parse(message.body).body;
      setChatMessages(oldArray => [...oldArray, chatMessageResponse.payload]);

      if (usersResponse && !window.location.pathname.includes("chats") && chatMessageResponse.payload.receiverId === authState?.user?.id) {
         toast.success(formatNotificationMessage(chatMessageResponse.payload), infoToastOptions());
      }
   }

   const onChatNotificationReceived = (message: Message) => {
      const notificationResponse: Response<ChatNotification> = JSON.parse(message.body).body;
      const {type, senderId} = notificationResponse.payload;

      setTypingMap(prev => ({
         ...prev,
         [senderId]: type === ChatNotificationType.START_TYPING,
      }));
   }

   const onChatClick = (user: User) => {
      setSelectedUser(selectedUser === user ? null : user);
   }

   const sendChatMessage = (text: string) => {
      if (wsClient) {
         const chatMessage: Partial<ChatMessage> = {
            senderId: authState.user?.id,
            receiverId: selectedUser?.id,
            message: text,
            edited: false
         };

         wsClient.send(WebsocketPaths.sendChatMessage, {}, JSON.stringify(chatMessage));
      }
   }

   const sendChatNotification = (type: ChatNotificationType) => {
      if (wsClient) {
         const notification: Partial<ChatNotification> = {
            senderId: authState.user?.id,
            receiverId: selectedUser?.id,
            type: type
         };

         wsClient.send(WebsocketPaths.sendChatNotification, {}, JSON.stringify(notification));
      }
   }

   useEffect(() => {
      if (authState.user && selectedUser) {
         triggerGetConversation({senderId: authState.user.id, receiverId: selectedUser.id}, false).unwrap()
            .then(data => setChatMessages(data.payload));
      }
   }, [selectedUser, authState.user, triggerGetConversation]);

   useEffect(() => {
      if (usersResponse) {
         const userStatus: Record<string, boolean> = usersResponse.payload.reduce((acc, user) => {
            acc[user.id] = false;
            return acc;
         }, {} as Record<string, boolean>);

         setTypingMap(userStatus);
      }

      const subscribeToChats = () => {
         if (wsClient && !authState.subscriptions.includes(Topic.CHAT)) {
            dispatch(subscribe(Topic.CHAT));
            wsClient.subscribe(`/user${Topic.CHAT}`, onChatMessageReceived);
         }
      };

      const subscribeToChatNotifications = () => {
         if (wsClient && !authState.subscriptions.includes(Topic.CHAT_NOTIFICATIONS)) {
            dispatch(subscribe(Topic.CHAT_NOTIFICATIONS));
            wsClient.subscribe(`/user${Topic.CHAT_NOTIFICATIONS}`, onChatNotificationReceived);
         }
      }

      setTimeout(() => {
         subscribeToChats();
         subscribeToChatNotifications();
      }, 2000);

      return () => {
      };
   }, [usersResponse]);

   return (
      <div className="w-full h-screen bg-background-accent overflow-auto text-background-reverse flex flex-row py-3 px-2">

         {/* Select Chat */}
         <div className="h-full border-r-[1px] border-r-primary-color pr-2">

            <div className="flex flex-col py-2">
               <ChatCard
                  key={authState.user?.id}
                  label={authState.user?.username ?? ""}
                  subLabel={`${authState.user?.role} - You`}
                  selected={false}
                  forDisplay={true}
               />
               <div className="w-full h-[1px] bg-primary-color my-2"/>
            </div>

            <div className="flex flex-col gap-1">
               {usersResponse?.payload?.filter(user => user.id !== authState.user?.id)
                  .map((user: User) => (
                     <ChatCard
                        key={user.id}
                        label={user.username}
                        subLabel={user.role}
                        onClick={() => onChatClick(user)}
                        selected={selectedUser?.id === user.id}
                        typing={typingMap[user.id]}
                     />
                  ))}
            </div>
         </div>

         {/* View Chat */}
         <ViewChat
            selectedUser={selectedUser}
            onEnterPressed={sendChatMessage}
            chatMessages={chatMessages}
            onType={sendChatNotification}
            typing={typingMap[selectedUser?.id ?? ""]}
         />
      </div>
   )
}