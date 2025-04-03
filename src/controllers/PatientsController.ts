import { FailedResponseDto } from "../dtos/FailedResponseDto";
import { iPatientDto } from "../dtos/PatientDto";
import { iApiCallInterface } from "../models/iApiCallInterface";
import iPatients from "../models/iPatients";
import { getCookie } from "../utils/cookies";

const baseURL = "http://localhost:3000/api/patient";

export const createPatient = async (inputs: iApiCallInterface) => {
  try {
    const idToken = getCookie("JwtToken");
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      inputs.afterAPISuccess((data as { patient: any }).patient);
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
    const idToken = getCookie("JwtToken");
    const response = await fetch(baseURL + "/getall", {
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

export const findPatient = async (inputs: iApiCallInterface) => {
  try {
    const idToken = getCookie("JwtToken");
    const response = await fetch(baseURL + "/find", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${idToken}`,
      },
      body: JSON.stringify(inputs.data as iPatientDto),
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


