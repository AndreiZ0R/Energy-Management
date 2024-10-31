interface BaseEntity {
   id: string;
}

type UserRole = "User" | "Manager";

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
   UserRole,
   User,
   Device,
   AuthenticationResponse
}