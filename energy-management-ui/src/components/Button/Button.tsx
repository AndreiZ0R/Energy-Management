import {BaseProps} from "../../utils/constants.ts";
import {MouseEventHandler} from "react";
import {AiOutlineLoading} from "react-icons/ai";
import {ButtonType} from "./ButtonType.tsx";

type ButtonProps = {
    label: string,
    onClick: MouseEventHandler<HTMLElement>,
    buttonType?: ButtonType,
    type?: "button" | "submit" | "reset",
    formId?: string;
    disabled?: boolean;
} & BaseProps;

export default function Button({label, onClick, buttonType = ButtonType.PRIMARY, additionalStyles, type = "button", formId, disabled}: ButtonProps) {

    const primaryStyle = "px-3 py-2 bg-primary-color text-white rounded-md bold align-middle transition duration-200 ease-linear hover:bg-primary-color/75";
    const secondaryStyle = "px-3 py-2 bg-transparent text-primary-color border border-primary-color rounded-md bold align-middle transition duration-200 ease-linear hover:bg-primary-color/75 hover:border-transparent hover:text-white";
    const tertiaryStyle = "px-3 py-2 bg-transparent text-primary-color rounded-md bold align-middle transition duration-200 ease-linear hover:text-primary-color/75 underline";

    const getButtonStyle = (): string => {
        switch (buttonType) {
            case ButtonType.PRIMARY:
                return primaryStyle;
            case ButtonType.SECONDARY:
                return secondaryStyle;
            case ButtonType.TERTIARY:
                return tertiaryStyle;
            default:
                return primaryStyle;
        }
    }

    return (
        <button
            disabled={disabled}
            type={type}
            form={formId}
            className={`${getButtonStyle()} ${additionalStyles} ${disabled ? "cursor-not-allowed bg-primary-color/25 hover:bg-primary-color/25 flex flex-row items-center justify-center gap-3" : ""} `}
            onClick={onClick}>
            {label}
            {disabled ? <AiOutlineLoading className="text-white animate-spin"/> : ""}
        </button>
    )
}