import {useDispatch, useSelector} from "react-redux";
import {AuthState, endSession, selectAuthState} from "../redux/slices";
import {Navigate, useLocation} from 'react-router-dom';
import {ReactNode, useContext, useEffect} from "react";
import {AppRoutes} from "../utils/constants.ts";
import {WsContext} from "../main.tsx";
import {Client} from "stompjs";

type PrivateRouteProps = {
   children: ReactNode,
}

export default function PrivateRoute({children}: PrivateRouteProps) {
   const authState: AuthState = useSelector(selectAuthState);
   const location = useLocation();
   const dispatch = useDispatch();
   const wsClient = useContext<Client>(WsContext);


   useEffect(() => {
      if (!authState.loggedIn && authState.user) {
         wsClient.disconnect(() => console.log("WS Client disconnected."));
         dispatch(endSession());
      }
   }, [authState, dispatch, wsClient]);

   return authState.loggedIn ?
      (<>{children}</>)
      : <Navigate to={`${AppRoutes.LOGIN}?from=${location.pathname}${location.search}`} replace={true}/>;
};