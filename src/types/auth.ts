import { auth } from "@/lib/auth";

export type UserRole = "user" | "host" | "admin";

// export interface SessionUser {
//   id: string;
//   name: string;
//   email: string;
//   emailVerified: boolean;
//   image?: string | null;
//   createdAt: Date;
//   updatedAt: Date;
//   userRole: UserRole;
//   banned?: boolean;
//   twoFactorEnabled?: boolean;
// }

type Session = Awaited<ReturnType<typeof auth.api.getSession>>;

export type SessionUser = NonNullable<Session>["user"];