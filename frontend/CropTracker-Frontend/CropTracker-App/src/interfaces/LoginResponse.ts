import type { Role } from "./Role"

export interface LoginResponse {
    username: string,
    roles: Role[],
    accessToken: string
    avatar: string,
    firstName: string,
    lastName: string
    email: string
}