import {ChatMessage} from "@/models/entities.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../store.ts";
import {Client, over} from "stompjs";
import SockJS from "sockjs-client";

export interface SocketState {
   client: Client;
   chatClient: Client;
   messages: ChatMessage[];
   lastReadMessageId: string;
   typingMap: Record<string, boolean>;
}

const initialState: SocketState = {
   messages: [],
   lastReadMessageId: "",
   client: over(new SockJS("/socket")),
   chatClient: over(new SockJS("/chatSocket")),
   typingMap: {},
}

export const socketSlice = createSlice({
   name: "SocketSlice",
   initialState,
   reducers: {

      pushMessage: (state, action: PayloadAction<ChatMessage>) => {
         state.messages.push(action.payload);
      },

      pushMessages: (state, action: PayloadAction<ChatMessage[]>) => {
         state.messages.push(...action.payload);
      },

      setLastReadMessage: (state, action: PayloadAction<string>) => {
         state.lastReadMessageId = action.payload;
      },

      setTypingMap: (state, action: PayloadAction<Record<string, boolean>>) => {
         state.typingMap = action.payload;
      },

      refreshState: (state) => {
         state.messages = [];
         state.lastReadMessageId = "";
         state.typingMap = {};
      },

   },
});

export const {
   pushMessage,
   pushMessages,
   setLastReadMessage,
   setTypingMap,
   refreshState,
} = socketSlice.actions;
export const selectSocketState = (state: RootState) => state.socket as SocketState;
export default socketSlice.reducer;