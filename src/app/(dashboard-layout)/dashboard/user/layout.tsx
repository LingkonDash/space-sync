import { requireRole } from "@/lib/core/session";

export default async function UserLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    await requireRole('user')

    return (
        <> {children} </>
    );
}
