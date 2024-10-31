import {authSlice, themeSlice} from "./slices";
import {configureStore} from "@reduxjs/toolkit";
import {setupListeners} from "@reduxjs/toolkit/query";
import {api} from "./api.ts";

export const store = configureStore({
   reducer: {
      [api.reducerPath]: api.reducer,
      auth: authSlice.reducer,
      theme: themeSlice.reducer,
   },
   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.dispatch>;
export type AppDispatch = typeof store.dispatch;
