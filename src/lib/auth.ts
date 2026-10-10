import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = "jablab-secret-key-change-this-in-prod";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function setSession(userId: string, role: string) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, role, expires });

  cookies().set("session", session, { expires, httpOnly: true });
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function logout() {
  cookies().set("session", "", { expires: new Date(0) });
}

export async function setMemberSession(member: { id: string; name: string; phone: string; email?: string | null }) {
  // Members stay logged in for 90 days on their mobile device for seamless gym wall QR scanning
  const expires = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
  const session = await encrypt({
    memberId: member.id,
    name: member.name,
    phone: member.phone,
    email: member.email || null,
    role: "MEMBER",
    expires,
  });

  cookies().set("member_session", session, {
    expires,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });
}

export async function getMemberSession(): Promise<{ memberId: string; name: string; phone: string; email?: string | null; role: string } | null> {
  const token = cookies().get("member_session")?.value;
  if (!token) return null;
  try {
    const payload = await decrypt(token);
    if (!payload || payload.role !== "MEMBER" || !payload.memberId) return null;
    return payload as { memberId: string; name: string; phone: string; email?: string | null; role: string };
  } catch {
    return null;
  }
}

export async function logoutMember() {
  cookies().set("member_session", "", { expires: new Date(0), path: "/" });
}

