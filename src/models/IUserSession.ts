import { DoctorDetails } from "./iDoctorDetails";
import { User } from "./IUser";

export interface UserSession {
    user: User; 
    doctorDetails: DoctorDetails;
    token: string;
    isSignedIn: boolean;
}