import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserSession()
  
  if (!user) redirect('/unauthorized')

  const session = { user }

  return (
    <>
      <DashboardSidebar session={session} />
      <main className="lg:pl-80">{children}</main>
    </>
  );
}