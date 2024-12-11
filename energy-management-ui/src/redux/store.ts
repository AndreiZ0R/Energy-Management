import {authSlice, themeSlice} from "./slices";
import {configureStore} from "@reduxjs/toolkit";
import {setupListeners} from "@reduxjs/toolkit/query";
import {api} from "./api.ts";
import {socketSlice} from "@/redux/slices/socket-slice.ts";


export const store = configureStore({
   reducer: {
      [api.reducerPath]: api.reducer,
      auth: authSlice.reducer,
      theme: themeSlice.reducer,
      socket: socketSlice.reducer,
   },
   middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: false
   }).concat(api.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.dispatch>;
export type AppDispatch = typeof store.dispatch;
