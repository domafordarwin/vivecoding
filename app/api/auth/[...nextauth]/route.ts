import { handlers } from "@/lib/auth";

// Force Node.js runtime for bcrypt/crypto support
export const runtime = "nodejs";

export const { GET, POST } = handlers;
