import {FaChevronRight} from "react-icons/fa";
import {getAvatar} from "@/utils/avatar-utils.tsx";

type ChatCardProps = {
   onClick?: () => void;
   label: string;
   subLabel: string;
   selected: boolean;
   forDisplay?: boolean;
   typing?: boolean;
}

export default function ChatCard({onClick, label, subLabel, selected, forDisplay = false, typing = false}: ChatCardProps) {


   return (
      <div
         className={`${selected && "bg-primary-color/25"} group w-full p-2 flex flex-row items-center justify-between ${!forDisplay && "hover:bg-background-color cursor-pointer"} rounded-xl transition-all animate-fadeIn gap-10`}
         key={label}
         onClick={onClick}
      >
         <div className="flex flex-row items-center justify-start gap-3">
            {getAvatar(label)}

            <div>
               <div className={`text-xl ${!forDisplay && "group-hover:text-primary-color"} transition-all`}>{label}</div>
               <div className={`text-xs ${!forDisplay && "group-hover:text-accent-color"} text-gray-500 transition-all`}>
                  {typing ? "Typing..." : subLabel}
               </div>
            </div>
         </div>

         {!forDisplay && <FaChevronRight/>}
      </div>
   );
}