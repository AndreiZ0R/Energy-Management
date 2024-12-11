import {BaseEntity, BaseResponse, ChatMessage, MessageStatus, UserRole} from "./entities.ts";

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
interface Response<T extends BaseEntity | BaseEntity[] | BaseResponse | BaseResponse[] | BaseNotification | BaseNotification[]> {
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

interface BaseNotification {
   id: null;
}

interface Notification extends BaseNotification {
   message: string;
   type: NotificationType;
   userId: string;
}

export enum ChatNotificationType {
   START_TYPING = "START_TYPING",
   STOP_TYPING = "STOP_TYPING",
}

interface ChatNotification extends BaseNotification {
   senderId: string;
   receiverId: string;
   messageId: string | null;
   type: ChatNotificationType;
}

interface MessageAcknowledgement extends BaseNotification {
   messageId: string;
   acknowledgedBy: string;
   target: string;
}

export enum Topic {
   NOTIFICATIONS = "/topic/notifications/",
   CHAT = "/topic/chat/",
   CHAT_NOTIFICATIONS = "/topic/chatNotification/",
   ACK_MESSAGE = "/topic/ackMessage/"
}

interface ConversationDetails extends BaseResponse {
   messages: ChatMessage[];
   messageStatus: MessageStatus;
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
   MessageAcknowledgement,
   ConversationDetails
}