import { cookies } from "next/headers";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const AUTH_COOKIE = "admin_auth";

export async function isAuthenticated() {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get(AUTH_COOKIE);
    return authCookie?.value === "authenticated";
}

export async function login(password: string) {
    if (password === ADMIN_PASSWORD) {
        const cookieStore = await cookies();
        cookieStore.set(AUTH_COOKIE, "authenticated", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24, // 1 day
        });
        return true;
    }
    return false;
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE);
}
