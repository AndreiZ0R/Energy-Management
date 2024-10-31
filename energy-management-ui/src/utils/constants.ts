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
   MANAGE_USERS: "/manage/users",
   MANAGE_DEVICES: "/manage/devices"
};

export const HttpMethods = {
   GET: "GET",
   POST: "POST",
   PATCH: "PATCH",
   DELETE: "DELETE",
}

// const baseUrl: string = import.meta.env.API_URL ?? "http://localhost:8000";
export const Endpoints = {
   base: "/api",
   auth: "/ums/rest/auth",
   devices: "/dms/rest/devices",
   users: "/ums/rest/users",
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