import Avatar, {genConfig} from "react-nice-avatar";
import {ReactElement} from "react";

export const getAvatar = (seed: string): ReactElement => {
   const config = genConfig(seed);
   return <Avatar className="w-16 h-16" {...config}  />
}

export const getAvatarWithSize = (seed: string = "", size: number): ReactElement => {
   const config = genConfig(seed);
   return <Avatar className={`w-${size} h-${size}`} {...config}  />
}