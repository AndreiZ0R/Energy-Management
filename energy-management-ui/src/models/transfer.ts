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


interface ClientError {
   message: string;
}

enum ResponseStatus {
   OK = "OK",
   NOT_FOUND = "NOT_FOUND",
   UNAUTHORIZED = "UNAUTHORIZED",
   FORBIDDEN = "FORBIDDEN"
}

interface Response<T extends BaseEntity | BaseEntity[] | Notification> {
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
}

export enum Topic {
   NOTIFICATIONS = "/topic/notifications",
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
   Notification,
}