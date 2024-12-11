import {ChatMessage, User} from "@/models/entities.ts";
import ChatCard from "@/components/Card/ChatCard.tsx";
import {InputField} from "@/components";
import illustration from "@/assets/chat.png";
import {useEffect, useRef, useState} from "react";
import {AuthState, selectAuthState} from "@/redux/slices";
import {useSelector} from "react-redux";
import {ChatNotificationType} from "@/models/transfer.ts";
import ChatBubble from "@/components/Chat/ChatBubble.tsx";

type ViewChatProps = {
   selectedUser: User | null;
   onEnterPressed: (text: string) => void;
   chatMessages: ChatMessage[];
   lastReadMessageId: string;
   onType: (type: ChatNotificationType) => void;
   typing: boolean;
};

export default function ViewChat({selectedUser, onEnterPressed, chatMessages, onType, typing, lastReadMessageId}: ViewChatProps) {
   const authState: AuthState = useSelector(selectAuthState);
   const [messageText, setMessageText] = useState<string>("");
   const [hasStartedTyping, setHasStartedTyping] = useState<boolean>(false);
   const messagesRef = useRef<HTMLDivElement>(null);

   const isOwnMessage = (message: ChatMessage): boolean => {
      return authState.user?.id === message.senderId;
   }

   const scrollToBottom = () => {
      messagesRef.current?.scrollIntoView({behavior: "smooth"});
   }

   useEffect(() => {
      scrollToBottom();
   }, [chatMessages]);

   return selectedUser ?
      <div className="w-full flex flex-col justify-around p-2">
         <ChatCard
            key={selectedUser.id}
            label={selectedUser.username}
            subLabel={selectedUser.role}
            selected={false}
            forDisplay={true}
            typing={typing}
         />
         <div className="w-full h-[1px] bg-primary-color my-2"/>

         <div className="h-full w-full overflow-auto scrollbar my-2 px-2">
            {chatMessages.map((message: ChatMessage) =>
               <ChatBubble
                  key={message.id}
                  chatMessage={message}
                  ownMessage={isOwnMessage(message)}
                  hasLastRead={lastReadMessageId === message.id}
                  // Todo: optimization to show avatar here, it loads slow otherwise
                  // avatar={getAvatarWithSize(getMessageBubbleSeed(message), 12)}
               />
            )}
            <div ref={messagesRef}/>
         </div>

         <InputField
            label="Send a message ..."
            type="text" name="sendMessage"
            value={messageText}
            onChange={newValue => {
               setMessageText(newValue.target.value);
               if (!hasStartedTyping && newValue.target.value !== "") {
                  onType(ChatNotificationType.START_TYPING);
                  setHasStartedTyping(true);
               }

               if (hasStartedTyping && newValue.target.value === "") {
                  onType(ChatNotificationType.STOP_TYPING);
                  setHasStartedTyping(false);
               }
            }}
            onKeyDown={event => {
               if (event.key === "Enter") {
                  onEnterPressed(messageText);
                  onType(ChatNotificationType.STOP_TYPING);
                  setMessageText("");
                  setHasStartedTyping(false);
               }
            }}/>
      </div>
      :
      <div className="flex flex-col items-center justify-center w-full gap-5">
         <img src={illustration} alt=""/>
         Your selected conversation will appear here.
      </div>
}