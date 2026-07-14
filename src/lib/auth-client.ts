import { createAuthClient } from "better-auth/react";
import {
  adminClient,
  jwtClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";

import type { auth } from "@/lib/auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient(),
    jwtClient(),
  ],
});