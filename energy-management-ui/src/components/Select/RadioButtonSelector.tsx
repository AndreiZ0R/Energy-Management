import React, {ChangeEventHandler} from 'react';
import {UseFormRegister} from "react-hook-form";

type RadioButtonSelectorProps = {
   selectedOption?: string;
   options: string[];
   onChange?: ChangeEventHandler<HTMLInputElement>;
   name?: string,
   registerFn?: UseFormRegister<any>,
}

const RadioButtonSelector: React.FC<RadioButtonSelectorProps> = ({selectedOption, onChange, options, registerFn, name}) => {

   return (
      <div className="flex space-x-4">
         {options.map((option: string) => (
            <label
               key={option}
               className="flex items-center space-x-2 cursor-pointer text-background-reverse"
            >
               {registerFn && name ?
                  <input
                     {...registerFn(name)}
                     type="radio"
                     value={option}
                     className="form-radio h-4 w-4 transition duration-150 ease-in-out checked:bg-primary-color appearance-none rounded border border-background-reverse cursor-pointer"
                  /> :
                  <input
                     type="radio"
                     value={option}
                     checked={selectedOption === option}
                     onChange={onChange}
                     name={name}
                     className="form-radio h-4 w-4 transition duration-150 ease-in-out checked:bg-primary-color appearance-none rounded border border-background-reverse cursor-pointer"
                  />
               }
               <span className="text-background-reverse">{option}</span>
            </label>
         ))}
      </div>
   );
};

export default RadioButtonSelector;
