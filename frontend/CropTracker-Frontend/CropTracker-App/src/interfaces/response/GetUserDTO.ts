import type { GetCropFieldDTO } from "./GetCropFieldDTO";
import type { Role } from "../helper/Role";

export interface GetUserDTO {
    username: string,
    roles: Role[],
    firstName: string,
    lastName: string,
    email: string,
    cropFields: GetCropFieldDTO[]
}