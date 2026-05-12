export interface GetAdminUserDTO {
    id: string
    username: string
    firstName: string
    lastName: string
    email: string
    roles: string[]
    avatarSrc: string
    isActive: boolean
}