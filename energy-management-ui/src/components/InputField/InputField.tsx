import {ChangeEventHandler, HTMLInputTypeAttribute, useState} from "react";

import {FiEye, FiEyeOff} from "react-icons/fi";
import {UseFormRegister} from "react-hook-form";
import {BaseProps} from "../../utils/constants.ts";

type InputFieldProps = {
   label: string,
   type: HTMLInputTypeAttribute,
   errorLabel?: string | null,
   value?: string | number,
   onChange?: ChangeEventHandler<HTMLInputElement>,
   name?: string,
   registerFn?: UseFormRegister<any>,
} & BaseProps;

export default function InputField({label, type, value, onChange, errorLabel = null, additionalStyles, name, registerFn}: InputFieldProps) {
   const [typeCopy, setTypeCopy] = useState<HTMLInputTypeAttribute>(type);

   const inputStyle = `peer m-0 block h-[58px] w-full rounded border border-solid ${errorLabel ? "border-red-400 text-red-400 focus:border-primary-color focus:text-primary-color" : "text-background-reverse border-primary-color focus:border-primary-color"} bg-transparent bg-clip-padding px-3 py-4 font-normal leading-tight transition duration-200 ease-linear placeholder:text-transparent focus:pb-[0.625rem] focus:pt-[1.625rem] focus:outline-none peer-focus:text-background-reverse [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]`;

   const togglePassword = () => {
      setTypeCopy(typeCopy === "text" ? "password" : "text");
   }

   return (
      <div className="w-full">
         <div className={`relative ${additionalStyles}`}>
            {registerFn && name ?
               (<input
                  type={typeCopy}
                  className={inputStyle}
                  id={`floatingInput${label}`}
                  {...registerFn(name)}
                  onChange={onChange}
                  placeholder=""
               />) :
               (<input
                  type={typeCopy}
                  className={inputStyle}
                  id={`floatingInput${label}`}
                  value={value}
                  onChange={onChange}
                  name={name}
                  placeholder=""
               />)
            }
            <label
               htmlFor={`floatingInput${label}`}
               className={`pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 ${errorLabel ? "text-red-600" : "text-primary-color"} transition-[opacity,_transform] duration-200 ease-linear ${errorLabel ? "peer-focus:text-primary-color" : "peer-focus:text-primary-color"} peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none`}>
               {label}
            </label>
            {type === "password" && (typeCopy === "password" ?
               <FiEye className="text-primary-color absolute right-3 top-1/3 cursor-pointer" onClick={togglePassword} size={20}/> :
               <FiEyeOff className="text-primary-color absolute right-3 top-1/3 cursor-pointer" onClick={togglePassword} size={20}/>)
            }
         </div>
         <span className={`w-full text-sm ${errorLabel ? "text-red-500" : ""}`}>
            {errorLabel}
         </span>
      </div>
   );
}