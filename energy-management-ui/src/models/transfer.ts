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
   password: string;
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

interface Response<T extends BaseEntity | BaseEntity[]> {
   payload: T;
   message: string;
   status: ResponseStatus;
   errors: ClientError[];
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
   UpdateUserRequest
}