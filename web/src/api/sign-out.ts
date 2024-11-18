import cookies from "js-cookie";

export async function signOut() {
    cookies.remove("t21-arena-park.session-token", { path: "/" });
}