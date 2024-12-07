import {Outlet} from "react-router-dom";
import Navbar from "../components/Navbar/Navbar.tsx";
import {AuthState, selectAuthState} from "@/redux/slices";
import {useSelector} from "react-redux";
import {Toaster} from "react-hot-toast";

export default function Layout() {
   const authState: AuthState = useSelector(selectAuthState);

   return (
      <div className="flex flex-row h-screen w-full overflow-auto">
         {authState.loggedIn &&
             <Navbar/>
         }
         <div className="flex flex-col h-screen w-full overflow-auto">
            <Outlet/>
         </div>
         {/*<Footer/>*/}
         <Toaster/>
      </div>
   );
}