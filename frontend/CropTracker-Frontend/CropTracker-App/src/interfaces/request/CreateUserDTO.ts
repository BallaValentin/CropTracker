export interface CreateUserDTO {
    username: string,
    firstName: string,
    lastName: string,
    password: string,
    password2: string,
    email: string,
    isGrower: boolean,
    isWorker: boolean
}