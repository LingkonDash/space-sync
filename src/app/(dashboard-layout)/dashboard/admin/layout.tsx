import { requireRole } from "@/lib/core/session";

export default async function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    await requireRole('admin')

    return (
        <> {children} </>
    );
}
