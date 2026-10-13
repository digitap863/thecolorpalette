import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import {
  ADMIN_AUTH_COOKIE,
  AdminTokenPayload,
  signAdminToken,
  verifyAdminToken,
} from "./token";

export { ADMIN_AUTH_COOKIE, signAdminToken, verifyAdminToken };
export type { AdminTokenPayload };

/**
 * Hash plain text password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare plain text password with hashed password
 */
export async function comparePassword(
  plain: string,
  hashed: string
): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

/**
 * Retrieve current authenticated admin from request cookies (Server Components & Route Handlers)
 */
export async function getCurrentAdmin(): Promise<AdminTokenPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_AUTH_COOKIE)?.value;
    if (!token) return null;
    return await verifyAdminToken(token);
  } catch {
    return null;
  }
}
