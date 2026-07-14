import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { requireRole } from "@/lib/core/session";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if(!session?.user) redirect('/unauthorized')

  return (
    <>
      <DashboardSidebar session={session} />
      <main className="lg:pl-80">{children}</main>
    </>
  );
}