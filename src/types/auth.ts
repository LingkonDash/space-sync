export type UserRole = "user" | "host" | "admin";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  userRole: UserRole;
  banned: boolean;
  twoFactorEnabled: boolean;
}