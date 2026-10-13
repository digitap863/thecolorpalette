import { SignJWT, jwtVerify } from "jose";

export const ADMIN_AUTH_COOKIE = "cp_admin_token";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "color_pellet_luxury_admin_jwt_secret_key_2026_auth_secure";
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET);

export interface AdminTokenPayload {
  id: string;
  email: string;
  name: string;
  role: "admin" | "superadmin";
}

/**
 * Sign JWT for authenticated Admin session (Edge & Node compatible)
 */
export async function signAdminToken(
  payload: AdminTokenPayload
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);
}

/**
 * Verify JWT token and return decoded payload (Edge & Node compatible)
 */
export async function verifyAdminToken(
  token: string
): Promise<AdminTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as AdminTokenPayload;
  } catch {
    return null;
  }
}
