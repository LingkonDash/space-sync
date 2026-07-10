// 1. Define your custom, explicit types
export type UserSessionType = {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string;
    createdAt: Date;
    updatedAt: Date;
    role: string;
    banned: boolean;
    twoFactorEnabled: boolean;
};

export type SessionResult = {
    session: {
        id: string;
        userId: string; // standard casing
        expiresAt: Date;
        token: string;
        createdAt: Date;
        updatedAt: Date;
        ipAddress: string;
        userAgent: string;
    };
    user: UserSessionType;
};

// 2. Implement the function with explicit return types
export const getUserSession = async (): Promise<UserSessionType | null> => {
    // const session = await auth.api.getSession({
    //     headers: await headers()
    // })

    const session: SessionResult = {
        session: {
            id: "sess_9876543210abcdef",
            userId: "usr_1234567890abcdef",
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            token: "bat_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            createdAt: new Date(),
            updatedAt: new Date(),
            ipAddress: "192.168.1.1",
            userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36..."
        },
        user: {
            id: "usr_1234567890abcdef",
            name: "Alex Morgan",
            email: "alex.morgan@example.com",
            emailVerified: true,
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80",
            createdAt: new Date("2025-01-15T08:30:00Z"),
            updatedAt: new Date("2026-07-10T12:00:00Z"),
            role: "user",
            banned: false,
            twoFactorEnabled: false
        }
    };

    return session?.user ? { ...session.user } : null;
};