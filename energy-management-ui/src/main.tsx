import {createRoot} from 'react-dom/client'
import './index.css'
import {createBrowserRouter, Navigate, RouterProvider} from 'react-router-dom';
import Layout from "./pages/Layout.tsx";
import {Provider} from "react-redux";
import {store} from "./redux/store.ts";
import {AppRoutes} from "./utils/constants.ts";
import HomePage from "./pages/HomePage.tsx";
import PrivateRoute from "./pages/PrivateRoute.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import ManageDevicesPage from "./pages/ManageDevicesPage.tsx";
import ManagerDashboardPage from "./pages/ManagerDashboardPage.tsx";
import ChatsPage from "@/pages/ChatsPage.tsx";

const router = createBrowserRouter([
   {
      element: <Layout/>,
      errorElement: <div>Not found</div>,
      children: [{
         path: AppRoutes.PROTECTED,
         element: <Navigate to={AppRoutes.HOME} replace/>
      }, {
         path: AppRoutes.HOME,
         element: <PrivateRoute><HomePage/></PrivateRoute>,
      }, {
         path: AppRoutes.LOGIN,
         element: <LoginPage/>
      }, {
         path: AppRoutes.REGISTER,
         element: <RegisterPage/>
      }, {
         path: AppRoutes.DEVICES,
         element: <PrivateRoute><ManageDevicesPage/></PrivateRoute>
      }, {
         path: AppRoutes.MANAGER_DASHBOARD,
         element: <PrivateRoute><ManagerDashboardPage/></PrivateRoute>
      }, {
         path: AppRoutes.CHATS,
         element: <PrivateRoute><ChatsPage/></PrivateRoute>
      }]
   }
]);

// export type WsContext = {
//    client: Client | null;
//    chatClient: Client | null;
// };

// const stompClient: Client = over(new SockJS('/socket'));
// stompClient.connect({}, frame => {
//    console.log("WS Client connected: ", frame);
// });
//
// const chatStompClient: Client = over(new SockJS('/chatSocket'));
// chatStompClient.connect({}, frame => {
//    console.log("Chat WS Client connected: ", frame);
// });

// const defaultWsContextValue = {
//    client: null,
//    chatClient: null
// };
//
// export const WsContext = createContext<WsContext>(defaultWsContextValue);


createRoot(document.getElementById('root')!).render(
   <Provider store={store}>
      {/*<WsContext.Provider value={defaultWsContextValue}>*/}
      <RouterProvider router={router}/>
      {/*</WsContext.Provider>*/}
   </Provider>
)
