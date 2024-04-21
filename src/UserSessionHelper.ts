import {cookies} from "next/headers";
import {User} from "./types/prismaTypes";

export default function getUserFromSession(): User | undefined {
    const cookie = cookies().get('session');
    return cookie?.value ? JSON.parse(cookie.value) : undefined;
}