import {useDispatch, useSelector} from "react-redux";
import {AuthState, endSession, selectAuthState} from "../redux/slices";
import {Navigate, useLocation} from 'react-router-dom';
import {ReactNode, useContext, useEffect} from "react";
import {AppRoutes} from "../utils/constants.ts";
import {WsContext} from "../main.tsx";
import {Client, Message} from "stompjs";
import {Notification, NotificationType, Response, Topic} from "../models/transfer.ts";
import {toast} from "react-hot-toast";
import {errorToastOptions, infoToastOptions, successToastOptions} from "../utils/toast.tsx";

type PrivateRouteProps = {
   children: ReactNode,
}

export default function PrivateRoute({children}: PrivateRouteProps) {
   const authState: AuthState = useSelector(selectAuthState);
   const location = useLocation();
   const dispatch = useDispatch();
   const wsClient = useContext<Client>(WsContext);

   useEffect(() => {
      const subscribeToNotifications = () => wsClient.subscribe(Topic.NOTIFICATIONS, (message: Message) => {
         const notificationResponse: Response<Notification> = JSON.parse(message.body).body;
         console.log(notificationResponse);

         const {message: notificationMessage, type, userId} = notificationResponse.payload;

         if (userId === authState.user?.id) {
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
         }
      });

      if (authState.loggedIn && authState.user) {
         setTimeout(() => {
            subscribeToNotifications();
         }, 2000);
      } else if (!authState.loggedIn) {
         wsClient.disconnect(() => console.log("WS Client disconnected."));
         dispatch(endSession());
      }

      return () => {
      };
   }, [authState, dispatch, wsClient]);

   return authState.loggedIn ?
      (<>{children}</>)
      : <Navigate to={`${AppRoutes.LOGIN}?from=${location.pathname}${location.search}`} replace={true}/>;
};