import { redirect } from "next/navigation";
import { getUserSession } from "@/lib/core/session";
import Profile from "./Profile";

export default async function ProfilePage() {
  const user = await getUserSession();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen w-full bg-neutral-bg px-4 py-6 sm:px-6 lg:px-8">
      <Profile user={user} />
    </div>
  );
}