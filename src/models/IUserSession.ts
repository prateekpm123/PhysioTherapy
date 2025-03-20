import { User } from "./IUser";

export interface UserSession {
    user: User; 
    token: string;
    isSignedIn: boolean;
}