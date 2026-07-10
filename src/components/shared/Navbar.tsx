import { getUserSession } from "@/lib/core/server";
import type { SessionUser } from "@/types/auth";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const user = (await getUserSession()) as SessionUser | null;

  return <NavbarClient user={user} />;
}