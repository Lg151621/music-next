// src/app/api/auth/[...nextauth]/route.ts
import { handlers } from "auth";

// Use the Auth.js handlers for this catch-all auth route
export const { GET, POST } = handlers;
