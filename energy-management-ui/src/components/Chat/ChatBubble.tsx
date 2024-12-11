import {formatHoursMinutes} from "@/utils/date-format.ts";
import {ChatMessage} from "@/models/entities.ts";
import {RiCheckDoubleLine} from "react-icons/ri";
import {ReactElement} from "react";

type ChatBubbleProps = {
   chatMessage: ChatMessage;
   ownMessage: boolean;
   hasLastRead?: boolean;
   avatar?: ReactElement;
}

export default function ChatBubble({chatMessage, ownMessage, hasLastRead = false, avatar}: ChatBubbleProps) {
   return (
      <div className={`flex flex-row w-full ${ownMessage ? "justify-end" : "justify-start"} items-center gap-2`} key={chatMessage.id}>
         {!ownMessage && avatar}
         <div className={`px-3 py-2 w-fit rounded-xl ${ownMessage ? "bg-primary-color" : "bg-accent-color"} my-1`}>
            <div className="text-xl text-white">{chatMessage.message}</div>
            <div className="flex flex-row items-center justify-start gap-2">
               <div className="text-xs text-gray-300">{formatHoursMinutes(chatMessage.timestamp)}</div>
               {hasLastRead && <RiCheckDoubleLine className="text-white"/>}
            </div>
         </div>
         {ownMessage && avatar}
      </div>
   );
}