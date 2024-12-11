interface BaseEntity {
   id: string;
}

interface BaseResponse {
   id: null;
}

export enum UserRole {
   USER = "User",
   MANAGER = "Manager"
}

interface User extends BaseEntity {
   username: string;
   email: string;
   createdAt: Date;
   role: UserRole;
   deviceIds: string[];
}

interface Device extends BaseEntity {
   description: string;
   address: string;
   maximumHourlyConsumption: number;
   userId: string;
}

interface HourlyConsumption extends BaseEntity {
   consumption: number;
   timestamp: Date;
}

interface MonitoredDevice extends BaseEntity, Device {
   deviceId: string;
   monitored: boolean;
   hourlyConsumptions: HourlyConsumption[];
}

interface ChatMessage extends BaseEntity {
   senderId: string;
   receiverId: string;
   message: string;
   edited: boolean;
   timestamp: Date;
}

interface MessageStatus extends BaseResponse {
   userId: string;
   lastReadMessageId: string;
}

interface AuthenticationResponse extends BaseResponse {
   user: User;
   token: string;
}

export type {
   BaseEntity,
   BaseResponse,
   User,
   Device,
   HourlyConsumption,
   MonitoredDevice,
   ChatMessage,
   MessageStatus,
   AuthenticationResponse
}