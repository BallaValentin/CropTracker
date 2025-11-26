import type { Plot } from "../Plot";
import type { Role } from "../Role";

export interface UserData {
    username: string,
    roles: Role[],
    firstName: string,
    lastName: string,
    email: string,
    plots: Plot[]
}