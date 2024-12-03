import {useState} from "react";
import {DayPicker} from "react-day-picker";
import {getDate} from "@/utils/date-format.ts";
import {IoCalendarOutline} from "react-icons/io5";

type AppPickerProps = {
   selectedDate: Date;
   onSelect: (date: Date | undefined) => void;
};

export default function AppPicker({selectedDate, onSelect}: AppPickerProps) {
   const [hidden, setHidden] = useState<boolean>(true)

   const toggleHidden = () => setHidden(!hidden);

   return (
      <div className="w-60 transition-all">
         <button
            className="relative px-3 py-2 bg-background-color rounded-lg text-background-reverse shadow-md border border-gray-200 hover:bg-primary-color transition-all z-30"
            onClick={toggleHidden}>

            <div className="flex flex-row items-center justify-center gap-3">
               <IoCalendarOutline size={18}/>
               <div className="text-md tracking-wide">
                  {getDate(selectedDate)}
               </div>
            </div>
         </button>
         {!hidden &&
             <div className="absolute z-40">
                 <DayPicker
                     mode="single"
                     today={new Date()}
                     selected={selectedDate}
                     onSelect={onSelect}
                     classNames={{
                        root: "bg-background-color border border-gray-200 rounded-lg shadow-md p-4 transition-all flex-shrink-0", // Card-like container
                        months: "flex flex-col gap-2 text-background-reverse ", // Month container
                        caption_label: "text-lg font-medium text-background-reverse", // Month/year title
                        nav: "flex items-center justify-start my-1", // Navigation buttons container
                        chevron: "fill-background-reverse hover:bg-background-accent rounded",
                        table: "w-full border-collapse space-y-2", // Days grid
                        head_row: "text-sm text-gray-500 dark:text-gray-400", // Weekday header
                        head_cell: "py-1 px-2 font-medium text-center", // Weekday cells
                        row: "text-center text-sm", // Day rows
                        today: "ring-1 ring-background-reverse", // Today’s date
                        selected: "bg-primary-color text-white rounded shadow-sm ring-1 ring-slate-100", // Selected date
                        outside: "text-background-reverse/25", // Dates outside current month
                        day: "px-1 py-1 text-center hover:bg-background-accent rounded"
                     }}
                 />
             </div>
         }
      </div>
   );
}