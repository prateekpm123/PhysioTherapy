import { FailedResponseDto } from "../dtos/FailedResponseDto";
import { iApiCallInterface } from "../models/iApiCallInterface";
import iPatients from "../models/iPatients";
import { getCookie } from "../utils/cookies";

const baseURL = "http://localhost:3000/api/patient";
const idToken = getCookie("JwtToken");

export const createPatient = async (inputs: iApiCallInterface) => {
  try {
    console.log("Inputs:", idToken);
    const response = await fetch(baseURL + "/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${idToken}`,
      },
      body: JSON.stringify(inputs.data as iPatients),
    });
    const responseJson = await response.json();
    if (responseJson.ok) {
      const data = responseJson as unknown;
      inputs.afterAPISuccess(data);
      console.log("Backend response:", data);
    } else {
      inputs.afterAPIFail(responseJson as FailedResponseDto);
    }
  } catch (error) {
    console.error("Error creating patient:", error);
  }
};

export const getAllPatients = async (inputs: iApiCallInterface) => {
    try {
      const response = await fetch(baseURL + "/getall", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${idToken}`,
        },
        body: JSON.stringify(inputs.data as iPatients)
      });
      const responseJson = await response.json();
      if (responseJson.ok) {
        const data = responseJson as unknown;
        inputs.afterAPISuccess(data);
        console.log("Backend response:", data);
      } else {
        inputs.afterAPIFail(responseJson as FailedResponseDto);
      }
    } catch (error) {
      console.error("Error creating patient:", error);
    }
  };
