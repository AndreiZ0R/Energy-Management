import Button from "../components/Button/Button.tsx";
import {ButtonType} from "../components";
import {ThemeType} from "../utils/constants.ts";
import {changeTheme} from "../redux/slices";
import {useDispatch} from "react-redux";
import InputField from "../components/InputField/InputField.tsx";

export default function HomePage() {
   const dispatch = useDispatch();

   return (
      <>
         {/*<div className="bg-background-color text-primary-color p-5">Home Page <span className="ml-3 text-accent-color">accent</span></div>*/}
         {/*<div className="bg-background-accent text-primary-color p-5">Home Page <span className="ml-3 text-accent-color">accent</span></div>*/}
         {/*<button className="text-xl text-primary-color animate-slideIn" onClick={doLogin}>Login!</button>*/}
         <Button buttonType={ButtonType.SECONDARY} label={"Aloha"} onClick={() => {
            dispatch(changeTheme(ThemeType.LIGHT));
         }}/>
         <Button buttonType={ButtonType.PRIMARY} label={"Aloha"} onClick={() => {
            dispatch(changeTheme(ThemeType.DARK));
         }}/>

         <Button buttonType={ButtonType.TERTIARY} label={"Aloha"} onClick={() => {
            dispatch(changeTheme(ThemeType.LIGHT));
         }}/>

         <div className="bg-background-color p-5">
            <InputField label={"Fielder"} type={"text"}/>

         </div>

      </>
   );
}