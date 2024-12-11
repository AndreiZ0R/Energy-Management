import {useEffect, useState} from "react";
import {ChatMessage, User} from "@/models/entities.ts";
import {ChatNotification, ChatNotificationType, ConversationDetails, Response} from "@/models/transfer.ts";
import {useGetAllUsersQuery, useLazyGetConversationQuery} from "@/redux/api.ts";
import ChatCard from "@/components/Card/ChatCard.tsx";
import {AuthState, selectAuthState} from "@/redux/slices";
import {useDispatch, useSelector} from "react-redux";
import ViewChat from "@/components/Chat/ViewChat.tsx";
import {WebsocketPaths} from "@/utils/constants.ts";
import {pushMessages, refreshState, selectSocketState, setLastReadMessage, setTypingMap, SocketState} from "@/redux/slices/socket-slice.ts";

export default function ChatsPage() {
   const dispatch = useDispatch()
   const authState: AuthState = useSelector(selectAuthState);
   const socketState: SocketState = useSelector(selectSocketState);
   const {data: usersResponse} = useGetAllUsersQuery();
   const [triggerGetConversation] = useLazyGetConversationQuery();

   const [selectedUser, setSelectedUser] = useState<User | null>(null);

   const onChatClick = (user: User) => {
      const lastUser = selectedUser;
      setSelectedUser(selectedUser === user ? null : user);

      if (lastUser !== user || selectedUser === null) {
         dispatch(refreshState());
      }
   }

   const sendChatMessage = (text: string) => {
      const chatMessage: Partial<ChatMessage> = {
         senderId: authState.user?.id,
         receiverId: selectedUser?.id,
         message: text,
         edited: false
      };

      socketState.chatClient.send(WebsocketPaths.sendChatMessage, {}, JSON.stringify(chatMessage));
   }

   const sendChatNotification = (type: ChatNotificationType) => {
      const notification: Partial<ChatNotification> = {
         senderId: authState.user?.id,
         receiverId: selectedUser?.id,
         type: type
      };
      socketState.chatClient.send(WebsocketPaths.sendChatNotification, {}, JSON.stringify(notification));
   }

   useEffect(() => {
      if (authState.user && selectedUser) {
         const senderId = authState.user.id;
         const receiverId = selectedUser.id;

         triggerGetConversation({senderId: senderId, receiverId: receiverId}, false).unwrap()
            .then((data: Response<ConversationDetails>) => {
               if (data.payload?.messageStatus?.lastReadMessageId) {
                  const lastId = data.payload.messageStatus.lastReadMessageId;
                  dispatch(setLastReadMessage(lastId));
                  // setMessagesState(prev => ({
                  //    ...prev,
                  //    lastReadMessageId: lastId,
                  // }));
               }
               dispatch(pushMessages(data.payload.messages))
               // setMessagesState(prev => ({
               //    ...prev,
               //    chatMessages: data.payload.messages
               // }));
            });
      }
   }, [selectedUser, authState.user, triggerGetConversation, dispatch]);

   useEffect(() => {
      if (usersResponse) {
         const userStatus: Record<string, boolean> = usersResponse.payload.reduce((acc, user) => {
            acc[user.id] = false;
            return acc;
         }, {} as Record<string, boolean>);

         dispatch(setTypingMap(userStatus));
      }
   }, [dispatch, usersResponse]);

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
                        typing={socketState.typingMap[user.id]}
                     />
                  ))}
            </div>
         </div>

         {/* View Chat */}
         <ViewChat
            selectedUser={selectedUser}
            onEnterPressed={sendChatMessage}
            chatMessages={socketState.messages}
            onType={sendChatNotification}
            typing={socketState.typingMap[selectedUser?.id ?? ""]}
            lastReadMessageId={socketState.lastReadMessageId}
         />
      </div>
   )
}