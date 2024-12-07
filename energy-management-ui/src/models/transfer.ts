import {BaseEntity, UserRole} from "./entities.ts";

interface AuthenticationRequest {
   username: string;
   password: string;
}

interface CreateDeviceRequest {
   description: string;
   address: string;
   maximumHourlyConsumption: number;
}

interface CreateUserRequest {
   username: string;
   email: string;
   password: string;
   role: UserRole;
   deviceIds: string[];
}

interface GetDevicesByIdRequest {
   ids: string[];
}

interface UpdateDeviceRequest {
   id: string;
   description: string;
   address: string;
   maximumHourlyConsumption: number;
   userId: string;
}

interface UpdateUserRequest {
   id: string;
   username: string;
   email: string;
   // password: string;
   role: UserRole;
   deviceIds: string[];
}

interface GetConversationRequest {
   senderId: string;
   receiverId: string;
}

interface ClientError {
   message: string;
}

enum ResponseStatus {
   OK = "OK",
   NOT_FOUND = "NOT_FOUND",
   UNAUTHORIZED = "UNAUTHORIZED",
   FORBIDDEN = "FORBIDDEN"
}

// Todo: extract BaseNotification after updating MCS
interface Response<T extends BaseEntity | BaseEntity[] | Notification | ChatNotification> {
   payload: T;
   message: string;
   status: ResponseStatus;
   errors: ClientError[];
}

export enum NotificationType {
   INFO = "INFO",
   SUCCESS = "SUCCESS",
   ERROR = "ERROR"
}

interface Notification {
   message: string;
   type: NotificationType;
   userId: string;
}

export enum ChatNotificationType {
   START_TYPING = "START_TYPING",
   STOP_TYPING = "STOP_TYPING",
}

interface ChatNotification {
   senderId: string;
   receiverId: string;
   type: ChatNotificationType;
}

export enum Topic {
   NOTIFICATIONS = "/topic/notifications/",
   CHAT = "/topic/chat/",
   CHAT_NOTIFICATIONS = "/topic/chatNotification/",
}

export type {
   ClientError,
   ResponseStatus,
   Response,
   AuthenticationRequest,
   CreateDeviceRequest,
   CreateUserRequest,
   GetDevicesByIdRequest,
   UpdateDeviceRequest,
   UpdateUserRequest,
   GetConversationRequest,
   Notification,
   ChatNotification,
}