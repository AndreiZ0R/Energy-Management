import logo from "../../assets/logo.png";
import {RiDeviceFill, RiHome6Fill, RiLogoutBoxLine} from "react-icons/ri";
import {FaUsers} from "react-icons/fa6";
import {useState} from "react";
import {BiChevronsLeft, BiChevronsRight} from "react-icons/bi";
import {AuthState, changeTheme, endSession, selectAuthState, selectThemeState, ThemeState} from "../../redux/slices";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {AppRoutes, ThemeType} from "../../utils/constants.ts";
import {MdOutlineWbSunny} from "react-icons/md";
import {IoIosMoon} from "react-icons/io";

export default function Navbar() {
   const dispatch = useDispatch();
   const [expanded, setExpanded] = useState<boolean>(false);
   const authState: AuthState = useSelector(selectAuthState);
   const themeState: ThemeState = useSelector(selectThemeState);
   const navigate = useNavigate();

   const logout = () => {
      setTimeout(() => {
         dispatch(endSession());
         navigate("/login");
      }, 500);
   }

   const switchTheme = () => {
      dispatch(changeTheme(themeState.theme === ThemeType.LIGHT ? ThemeType.DARK : ThemeType.LIGHT));
   }

   return (
      <nav
         className={`flex flex-col bg-background-color ${expanded ? "w-40" : "w-16"} justify-between items-center min-w-16 py-4 transition-all border-r-2 border-r-primary-color`}>

         {/* Fist group */}
         <div className="flex flex-col gap-10 w-full">
            {/* Logo */}
            <div className="rounded-xl w-full h-12 flex items-center justify-center">
               <img src={logo} className="rounded-xl object-cover w-12 h-12" alt="ill"/>
            </div>

            {/* Menu */}
            <div className={`flex flex-col px-2 gap-6`}>
               <div
                  onClick={() => navigate(AppRoutes.HOME)}
                  className={`flex flex-row ${expanded && "hover:bg-primary-color"} w-full rounded-xl px-3 py-2 cursor-pointer items-center justify-start gap-5 transition-all`}>
                  <RiHome6Fill className={`text-background-reverse text-2xl cursor-pointer ${!expanded && "hover:text-primary-color"} transition-all`}/>
                  {expanded && <span className="text-background-reverse animate-slideIn">Home</span>}
               </div>
               {authState.user?.role == "Manager" &&
                   <div
                       onClick={() => navigate(AppRoutes.MANAGE_USERS)}
                       className={`flex flex-row ${expanded && "hover:bg-primary-color"} w-full rounded-xl px-3 py-2 cursor-pointer items-center justify-start gap-5 transition-all`}>
                       <FaUsers className={`text-background-reverse text-2xl cursor-pointer ${!expanded && "hover:text-primary-color"} transition-all`}/>
                      {expanded && <span className="text-background-reverse animate-slideIn">Users</span>}
                   </div>}
               <div
                  onClick={() => navigate(AppRoutes.MANAGE_DEVICES)}
                  className={`flex flex-row ${expanded && "hover:bg-primary-color"} w-full rounded-xl px-3 py-2 cursor-pointer items-center justify-start gap-5 transition-all`}>
                  <RiDeviceFill className={`text-background-reverse text-2xl cursor-pointer ${!expanded && "hover:text-primary-color"} transition-all`}/>
                  {expanded && <span className="text-background-reverse animate-slideIn">Devices</span>}
               </div>
               <div
                  onClick={switchTheme}
                  className={`flex flex-row ${expanded && "hover:bg-primary-color"} w-full rounded-xl px-3 py-2 cursor-pointer items-center justify-start gap-5 transition-all`}>
                  {themeState.theme === ThemeType.LIGHT ?
                     <MdOutlineWbSunny
                        className={`text-background-reverse text-2xl cursor-pointer ${!expanded && "hover:text-primary-color"} transition-all`}
                     /> :
                     <IoIosMoon
                        className={`text-background-reverse text-2xl cursor-pointer ${!expanded && "hover:text-primary-color"} transition-all`}
                     />
                  }
                  {expanded && <span className="text-background-reverse animate-slideIn">Theme</span>}
               </div>
               <div
                  onClick={logout}
                  className={`flex flex-row ${expanded && "hover:bg-primary-color"} w-full rounded-xl px-3 py-2 cursor-pointer items-center justify-start gap-5 transition-all`}>
                  <RiLogoutBoxLine className={`text-background-reverse text-2xl cursor-pointer ${!expanded && "hover:text-primary-color"} transition-all`}/>
                  {expanded && <span className="text-background-reverse animate-slideIn">Logout</span>}
               </div>
            </div>
         </div>

         {/* Expander */}
         {expanded ?
            <BiChevronsLeft className="text-background-reverse text-2xl cursor-pointer hover:text-primary-color transition-all"
                            onClick={() => setExpanded(false)}/> :
            <BiChevronsRight className="text-background-reverse text-2xl cursor-pointer hover:text-primary-color transition-all"
                             onClick={() => setExpanded(true)}/>
         }
      </nav>
   );
}