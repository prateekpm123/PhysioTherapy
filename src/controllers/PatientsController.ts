import { FailedResponseDto } from "../dtos/FailedResponseDto";
import { iPatientDto } from "../dtos/PatientDto";
import { iApiCallInterface } from "../models/iApiCallInterface";
import iPatients from "../models/iPatients";
import { getValidAuthToken } from "../utils/cookies";
import { backendUrl } from "../configDetails";
import { StatusAndErrorType } from "../models/StatusAndErrorType.enum";

const baseURL = `${backendUrl}/api/patient`;

export const createPatient = async (inputs: iApiCallInterface) => {
  try {
    const validToken = await getValidAuthToken();
    
    const response = await fetch(baseURL + "/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${validToken}`,
      },
      credentials: 'include',
      mode: 'cors',
      body: JSON.stringify(inputs.data as iPatients),
    });
    const responseJson = await response.json();
    if (responseJson.ok) {
      const data = responseJson as unknown;
      inputs.afterAPISuccess((data as { patient: iPatientDto }).patient);
      console.log("Backend response:", data);
    } else {
      inputs.afterAPIFail(responseJson as FailedResponseDto);
    }
  } catch (error) {
    console.error("Error creating patient:", error);
    inputs.afterAPIFail({
      message: "Failed to create patient",
      statusCode: 500,
      errorCode: StatusAndErrorType.InternalError,
      errors: error
    });
  }
};

export const getAllPatients = async (inputs: iApiCallInterface) => {
  try {
    const validToken = await getValidAuthToken();
    
    const response = await fetch(baseURL + "/getall", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${validToken}`,
      },
      credentials: 'include',
      mode: 'cors',
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
    console.error("Error getting patients:", error);
    inputs.afterAPIFail({
      message: "Failed to get patients",
      statusCode: 500,
      errorCode: StatusAndErrorType.InternalError,
      errors: error
    });
  }
};

export const findPatient = async (inputs: iApiCallInterface) => {
  try {
    const validToken = await getValidAuthToken();
    
    const response = await fetch(baseURL + "/find", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${validToken}`,
      },
      credentials: 'include',
      mode: 'cors',
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
    console.error("Error finding patient:", error);
    inputs.afterAPIFail({
      message: "Failed to find patient",
      statusCode: 500,
      errorCode: StatusAndErrorType.InternalError,
      errors: error
    });
  }
};


