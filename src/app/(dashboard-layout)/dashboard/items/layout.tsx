import { requireRole } from "@/lib/core/session";

export default async function HostAdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    await requireRole(['host', 'admin'])

    return (
        <> {children} </>
    );
}
