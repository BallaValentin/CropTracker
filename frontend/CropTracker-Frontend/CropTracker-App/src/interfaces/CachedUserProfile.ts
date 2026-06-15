export interface CachedUserProfile {
    username: string,
    firstName: string,
    lastName: string
    email: string,
    avatarBlob: Blob | null;
}