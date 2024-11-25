import {MdCheck, MdErrorOutline, MdInfoOutline} from "react-icons/md";
import {ToastOptions} from "react-hot-toast";

const baseToasterOptions: ToastOptions = {
   duration: 5000,
   className: "shadow-xl",
}

export const errorToastOptions = (): ToastOptions => {
   return {
      ...baseToasterOptions,
      icon: <MdErrorOutline size={20} className="text-white"/>,
      style: {backgroundColor: "#e57373", color: "white"}
   };
}

export const successToastOptions = (): ToastOptions => {
   return {
      ...baseToasterOptions,
      icon: <MdCheck size={20} className="text-green"/>,
      style: {backgroundColor: "#c8e6c9", color: "green"}
   };
}

export const infoToastOptions = (): ToastOptions => {
   return {
      ...baseToasterOptions,
      icon: <MdInfoOutline size={20} className="text-[#ebebeb]"/>,
      // style: {backgroundColor: "#72bbe1", color: "#ebebeb"}
      style: {backgroundColor: "#45ade7", color: "#ebebeb"}
   };
}

