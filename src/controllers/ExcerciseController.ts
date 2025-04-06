import { FailedResponseDto } from "../dtos/FailedResponseDto";
import { iApiCallInterface } from "../models/iApiCallInterface";
import { backendUrl } from "../configDetails";
import { StatusAndErrorType } from "../models/StatusAndErrorType.enum";
import { getValidAuthToken } from "../utils/cookies";

const baseURL = `${backendUrl}/api/excercise`;

export const getAllExcercises = async (inputs: iApiCallInterface) => {
  try {
    const validToken = await getValidAuthToken();
    
    const response = await fetch(baseURL + "/getall", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${validToken}`,
      },
      credentials: 'include',
      mode: 'cors'
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
    console.error("Error getting exercises:", error);
    inputs.afterAPIFail({
      message: "Failed to fetch exercises",
      statusCode: 500,
      errorCode: StatusAndErrorType.InternalError,
      errors: error
    });
  }
};

export const updateExcercise = async (inputs: iApiCallInterface) => {
  try {
    const validToken = await getValidAuthToken();
    
    const response = await fetch(baseURL + "/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${validToken}`,
      },
      credentials: 'include',
      mode: 'cors',
      body: JSON.stringify(inputs.data)
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
    console.error("Error updating exercise:", error);
    inputs.afterAPIFail({
      message: "Failed to update exercise",
      statusCode: 500,
      errorCode: StatusAndErrorType.InternalError,
      errors: error
    });
  }
};

export const createExcercise = async (inputs: iApiCallInterface) => {
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
      body: JSON.stringify(inputs.data)
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
    console.error("Error creating exercise:", error);
    inputs.afterAPIFail({
      message: "Failed to create exercise",
      statusCode: 500,
      errorCode: StatusAndErrorType.InternalError,
      errors: error
    });
  }
};

export const deleteOriginalExcercise = async (inputs: iApiCallInterface) => {
  try {
    const validToken = await getValidAuthToken();
    
    const response = await fetch(baseURL + "/deleteoriginal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${validToken}`,
      },
      credentials: 'include',
      mode: 'cors',
      body: JSON.stringify(inputs.data)
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
    console.error("Error deleting exercise:", error);
    inputs.afterAPIFail({
      message: "Failed to delete exercise",
      statusCode: 500,
      errorCode: StatusAndErrorType.InternalError,
      errors: error
    });
  }
};

export const saveExcercisePlan = async (inputs: iApiCallInterface) => {
  try {
    const validToken = await getValidAuthToken();
    
    const response = await fetch(baseURL + "/saveexcerciseplan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${validToken}`,
      },
      credentials: 'include',
      mode: 'cors',
      body: JSON.stringify(inputs.data)
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
    console.error("Error saving exercise plan:", error);
    inputs.afterAPIFail({
      message: "Failed to save exercise plan",
      statusCode: 500,
      errorCode: StatusAndErrorType.InternalError,
      errors: error
    });
  }
};

export const getExcercisePlans = async (inputs: iApiCallInterface) => {
  try {
    const validToken = await getValidAuthToken();
    
    const response = await fetch(baseURL + "/getallexcerciseplans", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${validToken}`,
      },
      credentials: 'include',
      mode: 'cors',
      body: JSON.stringify(inputs.data)
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
    console.error("Error getting exercise plans:", error);
    inputs.afterAPIFail({
      message: "Failed to get exercise plans",
      statusCode: 500,
      errorCode: StatusAndErrorType.InternalError,
      errors: error
    });
  }
};

export const getExcercisePlan = async (inputs: iApiCallInterface) => {
  try {
    const validToken = await getValidAuthToken();
    
    const response = await fetch(baseURL + "/getexcerciseplan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${validToken}`,
      },
      credentials: 'include',
      mode: 'cors',
      body: JSON.stringify(inputs.data)
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
    console.error("Error getting exercise plan:", error);
    inputs.afterAPIFail({
      message: "Failed to get exercise plan",
      statusCode: 500,
      errorCode: StatusAndErrorType.InternalError,
      errors: error
    });
  }
};

export const saveExcerciseCompletionData = async (inputs: iApiCallInterface) => {
  try {
    const validToken = await getValidAuthToken();
    
    const response = await fetch(baseURL + "/createExcerciseCompletions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${validToken}`,
      },
      credentials: 'include',
      mode: 'cors',
      body: JSON.stringify(inputs.data)
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
    console.error("Error saving exercise completion:", error);
    inputs.afterAPIFail({
      message: "Failed to save exercise completion",
      statusCode: 500,
      errorCode: StatusAndErrorType.InternalError,
      errors: error
    });
  }
};

export const saveExcercisePlanNotes = async (inputs: iApiCallInterface) => {
  try {
    const validToken = await getValidAuthToken();
    
    const response = await fetch(baseURL + "/createExcercisePlanNotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${validToken}`,
      },
      credentials: 'include',
      mode: 'cors',
      body: JSON.stringify(inputs.data)
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
    console.error("Error saving exercise plan notes:", error);
    inputs.afterAPIFail({
      message: "Failed to save exercise plan notes",
      statusCode: 500,
      errorCode: StatusAndErrorType.InternalError,
      errors: error
    });
  }
};

export const getExcerciseTrackingSessionData = async (inputs: iApiCallInterface) => {
  try {
    const validToken = await getValidAuthToken();
    
    const response = await fetch(baseURL + "/getTrackingSession", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${validToken}`,
      },
      credentials: 'include',
      mode: 'cors',
      body: JSON.stringify(inputs.data)
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
    console.error("Error getting tracking session data:", error);
    inputs.afterAPIFail({
      message: "Failed to get tracking session data",
      statusCode: 500,
      errorCode: StatusAndErrorType.InternalError,
      errors: error
    });
  }
};
