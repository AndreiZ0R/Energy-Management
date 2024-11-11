import {MdCheck, MdErrorOutline} from "react-icons/md";
import {ToastOptions} from "react-hot-toast";

export const errorToastOptions = (): ToastOptions => {
   return {
      duration: 5000,
      className: "shadow-xl",
      icon: <MdErrorOutline size={20} className="text-white"/>,
      style: {backgroundColor: "#e57373", color: "white"}
   };
}

export const successToastOptions = (): ToastOptions => {
   return {
      duration: 5000,
      className: "shadow-xl",
      icon: <MdCheck size={20} className="text-green"/>,
      style: {backgroundColor: "#c8e6c9", color: "green"}
   };
}
