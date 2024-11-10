import {useDispatch, useSelector} from "react-redux";
import {AuthState, endSession, selectAuthState} from "../redux/slices";
import {Navigate, useLocation} from 'react-router-dom';
import {ReactNode, useEffect} from "react";
import {AppRoutes} from "../utils/constants.ts";

type PrivateRouteProps = {
   children: ReactNode,
}

export default function PrivateRoute({children}: PrivateRouteProps) {
   const authState: AuthState = useSelector(selectAuthState);
   const location = useLocation();
   const dispatch = useDispatch();

   useEffect(() => {
      if (!authState.loggedIn && authState.user) {
         dispatch(endSession());
      }
   }, [authState, dispatch]);

   return authState.loggedIn ?
      (<>{children}</>)
      : <Navigate to={`${AppRoutes.LOGIN}?from=${location.pathname}${location.search}`} replace={true}/>;
};