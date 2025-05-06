import { createSlice } from "@reduxjs/toolkit/react";
import { UserSession } from "../models/IUserSession";
import { UserType } from "../models/UserType";
import { LoginDto } from "../dtos/SignInDto";
import { DoctorDetails } from "../models/iDoctorDetails";

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
  doctorDetails: {
    name: "",
    age: 0,
    country_code: "",
    phone_number: 0n,
    email: "",
    address: {
      address_line1: "",
      address_line2: "",
      pincode: 0,
      district: "",
      state: "",
      country: "",
    },
    pincode: 0,
    country: "",
    district: "",
    state: "",
    role: "",
    user_id: "",
    doctor_history: "",
    doctor_specialization: "",
    doctor_qualification: "",
    doctor_experience: "",
    doctor_awards: "",
    doctor_certification: "",
    d_id: "",
  },
  token: "",
  isSignedIn: false,
};

const userSessionSlice = createSlice({
  name: "userSession",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const userData = action.payload as LoginDto;
      state.user = {
        uid: userData.userGoogleAuthData.uid, // Preserve `uid` if needed
        type: UserType.DOCTOR, // Preserve `type` if needed
        name:
          userData.userGoogleAuthData.name || userData.userGoogleAuthData.email,
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
    setDoctorDetails: (state, action) => {
      const doctorData = action.payload as DoctorDetails;
      state.doctorDetails = {
        name: doctorData.name || doctorData.email,
        age: doctorData.age,
        country_code: doctorData.country_code,
        phone_number: doctorData.phone_number,
        email: doctorData.email,
        address: {
          address_line1: doctorData.address.address_line1,
          address_line2: doctorData.address.address_line2,
          pincode: doctorData.address.pincode,
          district: doctorData.address.district,
          state: doctorData.address.state,
          country: doctorData.address.country,
        },
        pincode: doctorData.address.pincode,
        country: doctorData.address.country,
        district: doctorData.address.district,
        state: doctorData.address.state,
        role: doctorData.role,
        user_id: doctorData.user_id,
        doctor_history: doctorData.doctor_history,
        doctor_specialization: doctorData.doctor_specialization,
        doctor_qualification: doctorData.doctor_qualification,
        doctor_experience: doctorData.doctor_experience,
        doctor_awards: doctorData.doctor_awards,
        doctor_certification: doctorData.doctor_certification,
        d_id: doctorData.d_id,
      };
    },
    setIsSignedIn: (state, action) => {
      state.isSignedIn = action.payload;
    },
  },
});

export const { setUser, setIsSignedIn, setDoctorDetails } =
  userSessionSlice.actions;
export default userSessionSlice.reducer;
