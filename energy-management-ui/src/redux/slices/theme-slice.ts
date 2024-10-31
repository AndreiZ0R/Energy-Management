import {Constants, getThemeType, ThemeType} from "../../utils/constants.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../store.ts";


export interface ThemeState {
   theme: ThemeType,
}

const initialState: ThemeState = {
   theme: getThemeType(localStorage.getItem(Constants.THEME) ?? "light"),
}

const switchTheme = (theme: ThemeType) => {
   const html = document.querySelector("html");
   html?.setAttribute("data-theme", theme);
}

switchTheme(initialState.theme);

export const themeSlice = createSlice({
   name: "theme",
   initialState,
   reducers: {
      changeTheme: (state, action: PayloadAction<ThemeType>) => {
         state.theme = action.payload;
         localStorage.setItem(Constants.THEME, state.theme);
         switchTheme(state.theme);
      },
   },
});

export const {changeTheme} = themeSlice.actions;
export const selectThemeState = (state: RootState) => state.theme as ThemeState;
export default themeSlice.reducer;