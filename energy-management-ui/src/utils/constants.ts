export const Constants = {
   TOKEN: "token",
   THEME: "theme",
   USER: "user",
   SESSION_ID: "sessionId",
}

export const HeaderUtils = {
   AUTHORIZATION_HEADER: "Authorization",
   SESSION_HEADER: "SESSION_ID",
   BUILD_AUTHORIZATION_HEADER: (token: string): string => `Bearer ${token}`,
};

export const AppRoutes = {
   PROTECTED: "/",
   HOME: "/home",
   LOGIN: "/login",
   REGISTER: "/register",
   MANAGER_DASHBOARD: "/manager-dashboard",
   DEVICES: "/devices",
   CHATS: "/chats"
};

export const HttpMethods = {
   GET: "GET",
   POST: "POST",
   PATCH: "PATCH",
   DELETE: "DELETE",
}

export const Endpoints = {
   base: "/api",
   auth: "/ums/rest/auth",
   devices: "/dms/rest/devices",
   users: "/ums/rest/users",
   monitoredDevices: "/mcs/rest/monitored-devices",
   chats: "/cs/rest/chats"
}

export const WebsocketPaths = {
   sendChatMessage: "/app/chat.send",
   sendChatNotification: "/app/chat.notifyTyping",
}

export enum ThemeType {
   LIGHT = "light",
   DARK = "dark",
}

export const getThemeType = (theme: string): ThemeType => {
   return theme === "light" ? ThemeType.LIGHT : ThemeType.DARK;
}

export type BaseProps = {
   additionalStyles?: string,
}