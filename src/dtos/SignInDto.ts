export interface SignInDto {
  message: string;
  userGoogleAuthData: GoogleUserDataDto;
  status: number;
}

export interface GoogleUserDataDto {
  name: string;
  picture: string;
  iss: string;
  aud: string;
  auth_time: number;
  user_id: string;
  sub: string;
  iat: number;
  exp: number;
  email: string;
  email_verified: true;
  firebase: {
    identities: {
      "google.com": string[];
      email: string[];
    };
    sign_in_provider: string;
  };
  uid: string;
}

/** Sample data */
// const test = {
//   name: "PRATEEK MANTA",
//   picture:
//     "https://lh3.googleusercontent.com/a/ACg8ocKwJs21tjy3rT_xdnTotyukKxqyd-BgyNotHR0HjJlDJ5aP1Zid=s96-c",
//   iss: "https://securetoken.google.com/physiotherapy-24e38",
//   aud: "physiotherapy-24e38",
//   auth_time: 1742479322,
//   user_id: "NBZxsSBJHEMMdZ9dGdDxqdVyUEi1",
//   sub: "NBZxsSBJHEMMdZ9dGdDxqdVyUEi1",
//   iat: 1742479322,
//   exp: 1742482922,
//   email: "prateekpm123@gmail.com",
//   email_verified: true,
//   firebase: {
//     identities: {
//       "google.com": ["117593445247132834259"],
//       email: ["prateekpm123@gmail.com"],
//     },
//     sign_in_provider: "google.com",
//   },
//   uid: "NBZxsSBJHEMMdZ9dGdDxqdVyUEi1",
// };
