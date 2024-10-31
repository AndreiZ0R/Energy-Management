import {MouseEventHandler, ReactElement} from "react";

export type DropdownItem = {
   label: string,
   onClick: MouseEventHandler<HTMLElement>,
   icon?: ReactElement,
}