import { FailedResponseDto } from "../dtos/FailedResponseDto";
import { SignInDto } from "../dtos/SignInDto";
import { Accounts } from "../models/Accounts";

export const sendIdTokenToBackend = async (
  idToken: string,
  accountType: Accounts,
  afterSignInSuccess: (data: SignInDto) => void,
  afterSignInFail: (response: FailedResponseDto) => void

) => {
  try {
    let url = "http://localhost:3000/auth";
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
      const data = (await response.json()) as SignInDto;
      afterSignInSuccess(data);
      console.log("Backend response:", data);
    } else {
      afterSignInFail(responseJson as FailedResponseDto);
    }
  } catch (error) {
    console.error("Error sending token to backend:", error);
  }
};
