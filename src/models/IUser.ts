import { UserType } from "./UserType";

export interface User {
  uid: string;
  pictureUrl: string;
  email: string;
  name: string;
  type: UserType;
  googleIss: string;
  googleAud: string;
  googleAuthTime: number;
  googleUserId: string;
  googleSub: string;
  googleIat: number;
  googleExp: number;
  googleEmailVerified: boolean;
  googleFireBaseIdentitiesGoogleDotCom: string[];
  googleIdentitiesEmail: string[];
  googleSignInProvider: string;

}
