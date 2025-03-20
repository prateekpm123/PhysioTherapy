import { createSlice } from "@reduxjs/toolkit/react";
import { UserSession } from "../models/IUserSession";
import { UserType } from "../models/UserType";
import { SignInDto } from "../dtos/SignInDto";

const initialState: UserSession = {
  user: {
    uid: "",
    pictureUrl: "",
    email: "",
    name: "",
    type: UserType.NOTCREATED,
    googleIss: "",
    googleAud: "",
    googleAuthTime: 0,
    googleUserId: "",
    googleSub: "",
    googleIat: 0,
    googleExp: 0,
    googleEmailVerified: false,
    googleFireBaseIdentitiesGoogleDotCom: [],
    googleIdentitiesEmail: [],
    googleSignInProvider: "",
  },
  token: "",
  isSignedIn: false,
};

const userSessionSlice = createSlice({
  name: "userSession",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const userData = action.payload as SignInDto;
      state.user = {
        uid: userData.userGoogleAuthData.uid, // Preserve `uid` if needed
        type: UserType.DOCTOR, // Preserve `type` if needed
        name: userData.userGoogleAuthData.name,
        pictureUrl: userData.userGoogleAuthData.picture,
        email: userData.userGoogleAuthData.email,
        googleIss: userData.userGoogleAuthData.iss,
        googleAud: userData.userGoogleAuthData.aud,
        googleAuthTime: userData.userGoogleAuthData.auth_time,
        googleUserId: userData.userGoogleAuthData.user_id,
        googleSub: userData.userGoogleAuthData.sub,
        googleIat: userData.userGoogleAuthData.iat,
        googleExp: userData.userGoogleAuthData.exp,
        googleEmailVerified: userData.userGoogleAuthData.email_verified,
        googleFireBaseIdentitiesGoogleDotCom:
          userData.userGoogleAuthData.firebase.identities["google.com"],
        googleIdentitiesEmail:
          userData.userGoogleAuthData.firebase.identities.email,
        googleSignInProvider:
          userData.userGoogleAuthData.firebase.sign_in_provider,
      };
    },
    setIsSignedIn: (state, action) => {
      state.isSignedIn = action.payload;
    },
  },
});

export const { setUser, setIsSignedIn } = userSessionSlice.actions;
export default userSessionSlice.reducer;
