import { FailedResponseDto } from "../dtos/FailedResponseDto";
import { LoginDto, SignInDto } from "../dtos/SignInDto";
import { Accounts } from "../models/Accounts";
// import { getCookie } from "../utils/cookies";



export const sendIdTokenToBackendSignUp = async (
  idToken: string,
  accountType: Accounts,
  afterSignInSuccess: (data: SignInDto) => void,
  afterSignInFail: (response: FailedResponseDto) => void
) => {
  try {
    let url = "http://localhost:3000/api/signup/auth";
    if (accountType === Accounts.FACEBOOK) {
      url = url + "/facebook";
    } else if (accountType === Accounts.GOOGLE) {
      url = url + "/google";
    } else if (accountType === Accounts.EMAIL) {
      url = url + "/email";
    }
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    });
    const responseJson = await response.json();
    if (responseJson.ok) {
      const data = responseJson as SignInDto;
      afterSignInSuccess(data);
      console.log("Backend response:", data);
    } else {
      afterSignInFail(responseJson as FailedResponseDto);
    }
  } catch (error) {
    console.error("Error sending token to backend:", error);
  }
};
export const sendIdTokenToBackendLogin = async (
  idToken: string,
  accountType: Accounts,
  afterSignInSuccess: (data: LoginDto) => void,
  afterSignInFail: (response: FailedResponseDto) => void
) => {
  try {
    let url = "http://localhost:3000/api/login/auth";
    if (accountType === Accounts.FACEBOOK) {
      url = url + "/facebook";
    } else if (accountType === Accounts.GOOGLE) {
      url = url + "/google";
    } else if (accountType === Accounts.EMAIL) {
      url = url + "/email";
    }
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    });
    const responseJson = await response.json();
    if (responseJson.ok) {
      const data = responseJson as LoginDto;
      afterSignInSuccess(data);
      console.log("Backend response:", data);
    } else {
      afterSignInFail(responseJson as FailedResponseDto);
    }
  } catch (error) {
    console.error("Error sending token to backend:", error);
  }
};

export const saveJwtToken = async (idToken: string) => {
  try {
    const url = "http://localhost:3000/api/cookie/setJwtCookie";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    });
    const responseJson = await response.json();
    if (responseJson.ok) {
      console.log("token was saved");
    } else {
      console.log("token save  was failed ");
    }
    return responseJson;
  } catch (error) {
    console.error("Error sending token to backend:", error);
  }
};

export const getJwtToken = async () => {
  try {
    const url = "http://localhost:3000/api/cookie/getJwtCookie";
    const response = await fetch(url, {
      method: "GET",
    });
    const responseJson = await response.json();
    if (responseJson.ok) {
      console.log("token was saved");
    } else {
      console.log("token save  was failed ");
    }
    return responseJson;
  } catch (error) {
    console.error("Error sending token to backend:", error);
  }
};
