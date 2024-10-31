import {AuthenticationResponse, User} from "../../models/entities.ts";
import {Constants} from "../../utils/constants.ts";
import Cookies from "js-cookie";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../store.ts";

export interface AuthState {
   user: User | null;
   token: string | null;
   loggedIn: boolean;
}

const getInitialUser = (): User | null => {
   const storedUser = localStorage.getItem(Constants.USER);
   if (storedUser) {
      return JSON.parse(storedUser) as User;
   }

   return null;
}

const initialState: AuthState = {
   user: getInitialUser(),
   token: Cookies.get(Constants.TOKEN) ?? null,
   loggedIn: !!Cookies.get(Constants.TOKEN),
}

export const authSlice = createSlice({
   name: "AuthSlice",
   initialState,
   reducers: {
      endSession: (state) => {
         state.user = null;
         state.loggedIn = false;
         Cookies.remove(Constants.TOKEN);
         Cookies.remove(Constants.SESSION_ID);
         localStorage.removeItem(Constants.USER);
      },
      startSession: (state, action: PayloadAction<AuthenticationResponse>) => {
         state.user = action.payload.user;
         state.loggedIn = true;
         Cookies.set(Constants.TOKEN, action.payload.token, {expires: 7, secure: true});
         localStorage.setItem(Constants.USER, JSON.stringify(state.user));
      },
   },
});

export const {startSession, endSession} = authSlice.actions;
export const selectAuthState = (state: RootState) => state.auth as AuthState;
export default authSlice.reducer;