import {Outlet} from "react-router-dom";
import Navbar from "../components/Navbar/Navbar.tsx";
import {AuthState, selectAuthState} from "../redux/slices";
import {useSelector} from "react-redux";

export default function Layout() {
   const authState: AuthState = useSelector(selectAuthState);


   return (
      <div className="flex flex-row h-screen w-full">
         {authState.loggedIn &&
             <Navbar/>
         }
         <div className="flex flex-col h-screen w-full">
            <Outlet/>
         </div>
         {/*<Footer/>*/}
      </div>
   );
}