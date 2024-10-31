import {MdErrorOutline} from "react-icons/md";
import {ToastOptions} from "react-hot-toast";

export const errorToastOptions = (): ToastOptions => {
   return {
      className: "shadow-xl",
      icon: <MdErrorOutline size={20} className="text-white"/>,
      style: {backgroundColor: "#e57373", color: "white"}
   };
}

export const successToastOptions = (): ToastOptions => {
   return {
      className: "shadow-xl",
      style: {backgroundColor: "#c8e6c9", color: "green"}
   };
}
