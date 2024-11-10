import {useState} from 'react';
import {FaCheck, FaChevronDown, FaChevronUp} from "react-icons/fa";

export type DropdownOption = {
   value: string;
   label: string;
   optionalDescription?: string;
}

type MultiSelectDropdownProps = {
   placeholder: string;
   options: DropdownOption[];
   selectedValues: DropdownOption[];
   onChange: (selectedOptions: DropdownOption[]) => void;
}

export default function MultiSelector({placeholder, options, selectedValues, onChange}: MultiSelectDropdownProps) {
   const [isOpen, setIsOpen] = useState(false);

   const toggleDropdown = () => setIsOpen(!isOpen);

   const handleOptionClick = (option: DropdownOption) => {
      const isSelected = selectedValues.some((selected) => selected.value === option.value);
      const updatedValues = isSelected ?
         selectedValues.filter((selected) => selected.value !== option.value) :
         [...selectedValues, option];

      onChange(updatedValues);
   };

   const isOptionSelected = (option: DropdownOption) =>
      selectedValues.some((selected) => selected.value === option.value);

   return (
      <div className="relative transition-all">
         {/* Dropdown button */}
         <button
            type="button"
            onClick={toggleDropdown}
            className="w-full bg-background-accent border border-primary-color rounded px-3 py-4 text-left text-background-reverse shadow-sm focus:outline-none flex justify-between items-center"
         >
            <div className="flex flex-row gap-2 flex-wrap">
               {selectedValues.length > 0 ?
                  selectedValues.map(option =>
                     <span className="px-2 py-1 bg-background-color rounded flex flex-row items-center justify-center gap-1" key={option.label + option.value}>
                        {option.label}
                     </span>
                  ) :
                  placeholder
               }
            </div>

            <div>
               {isOpen ?
                  <FaChevronUp className="h-5 w-5 text-background-reverse"/> :
                  <FaChevronDown className="h-5 w-5 text-background-reverse"/>
               }
            </div>

         </button>

         {/* Dropdown menu */}
         {isOpen && (
            <div
               className="absolute mt-1 w-full bg-background-accent border border-primary-color rounded shadow-lg z-10 text-background-reverse transition-all">
               <ul className="max-h-60 overflow-y-auto">
                  {options.map((option, index) => (
                     <li
                        key={option.value + index}
                        className={`flex flex-row w-full justify-between items-center cursor-pointer px-3 py-4 hover:bg-primary-color/25 transition-all`}
                        onClick={() => handleOptionClick(option)}
                     >
                        <div className="flex flex-col">
                           <span className="flex-1">{option.label}</span>
                           <span className="text-sm text-gray-500">{option.optionalDescription}</span>
                        </div>

                        {isOptionSelected(option) && (
                           <FaCheck className="h-5 w-5 text-accent-color"/>
                        )}
                     </li>
                  ))}
               </ul>
            </div>
         )}
      </div>
   );
};
