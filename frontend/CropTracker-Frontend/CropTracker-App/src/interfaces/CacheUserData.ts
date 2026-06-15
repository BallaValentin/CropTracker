import type { Role } from "./Role";

export interface CacheUserData {
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    avatarURL: string,
    roles: Role[]
}