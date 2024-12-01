interface BaseEntity {
   id: string;
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

interface AuthenticationResponse extends BaseEntity {
   user: User;
   token: string;
}

export type {
   BaseEntity,
   User,
   Device,
   AuthenticationResponse
}