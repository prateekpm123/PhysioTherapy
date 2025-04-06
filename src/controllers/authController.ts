import { FailedResponseDto } from "../dtos/FailedResponseDto";
import { LoginDto, SignInDto } from "../dtos/SignInDto";
import { Accounts } from "../models/Accounts";
import { backendUrl } from "../configDetails";
import { StatusAndErrorType } from "../models/StatusAndErrorType.enum";
import { getValidAuthToken, setAuthToken } from "../utils/cookies";
import { getAuth } from "firebase/auth";

export const sendIdTokenToBackendSignUp = async (
  idToken: string,
  accountType: Accounts,
  afterSignInSuccess: (data: SignInDto) => void,
  afterSignInFail: (response: FailedResponseDto) => void
) => {
  try {
    let url = `${backendUrl}/api/signup/auth`;
    if (accountType === Accounts.FACEBOOK) {
      url = url + "/facebook";
    } else if (accountType === Accounts.GOOGLE) {
      url = url + "/google";
    } else if (accountType === Accounts.EMAIL) {
      url = url + "/email";
    }

    // Store the initial token
    const tokenResult = await getAuth().currentUser?.getIdTokenResult();
    if (tokenResult) {
      const expiresIn = new Date(tokenResult.expirationTime).getTime() - Date.now();
      await setAuthToken(idToken, expiresIn / 1000);
    }

    const validToken = await getValidAuthToken();

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${validToken}`,
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
    afterSignInFail({
      message: "Failed to authenticate with backend",
      statusCode: 500,
      errorCode: StatusAndErrorType.InternalError,
      errors: error
    });
  }
};

export const sendIdTokenToBackendLogin = async (
  idToken: string,
  accountType: Accounts,
  afterSignInSuccess: (data: LoginDto) => void,
  afterSignInFail: (response: FailedResponseDto) => void
) => {
  try {
    let url = `${backendUrl}/api/login/auth`;
    if (accountType === Accounts.FACEBOOK) {
      url = url + "/facebook";
    } else if (accountType === Accounts.GOOGLE) {
      url = url + "/google";
    } else if (accountType === Accounts.EMAIL) {
      url = url + "/email";
    }

    // Store the initial token with expiry
    const tokenResult = await getAuth().currentUser?.getIdTokenResult();
    if (tokenResult) {
      const expiresIn = new Date(tokenResult.expirationTime).getTime() - Date.now();
      await setAuthToken(idToken, expiresIn / 1000);
    }

    const validToken = await getValidAuthToken();

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${validToken}`,
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
    afterSignInFail({
      message: "Failed to authenticate with backend",
      statusCode: 500,
      errorCode: StatusAndErrorType.InternalError,
      errors: error
    });
  }
};

export const saveJwtToken = async (idToken: string) => {
  try {
    const url = `${backendUrl}/api/cookie/setJwtCookie`;
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
    const url = `${backendUrl}/api/cookie/getJwtCookie`;
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
