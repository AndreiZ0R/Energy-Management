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
import SockJS from "sockjs-client";
import {Client, Message, over} from "stompjs";
import {createContext} from "react";
import {toast} from "react-hot-toast";
import {errorToastOptions, infoToastOptions, successToastOptions} from "./utils/toast.tsx";
import {Notification, NotificationType, Response, Topic} from "./models/transfer.ts";

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
      }]
   }
]);

// Todo: maybe put subscribes here, remove WsContext and use redux to take actions
const stompClient: Client = over(new SockJS('/socket'));
stompClient.connect({}, frame => {
   console.log("WS Client connected: ", frame);

   stompClient.subscribe(Topic.NOTIFICATIONS, (message: Message) => {
      const notificationResponse: Response<Notification> = JSON.parse(message.body).body;
      console.log(notificationResponse);

      const {message: notificationMessage, type} = notificationResponse.payload;

      switch (type) {
         case NotificationType.INFO:
            toast.success(notificationMessage, infoToastOptions());
            break;
         case NotificationType.SUCCESS:
            toast.success(notificationMessage, successToastOptions());
            break;
         case NotificationType.ERROR:
            toast.error(notificationMessage, errorToastOptions());
            break;
      }
   })
})

export const WsContext = createContext<Client>(stompClient);

createRoot(document.getElementById('root')!).render(
   <Provider store={store}>
      <WsContext.Provider value={stompClient}>
         <RouterProvider router={router}/>
      </WsContext.Provider>
   </Provider>
)
