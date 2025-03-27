import { FailedResponseDto } from "../dtos/FailedResponseDto";
import { iApiCallInterface } from "../models/iApiCallInterface";
import { getCookie } from "../utils/cookies";


const baseURL = "http://localhost:3000/api/excercise";

export const getAllExcercises = async (inputs: iApiCallInterface) => {
  try {
    const idToken = getCookie("JwtToken");
    console.log("Inputs:", idToken);
    const response = await fetch(baseURL + "/getall", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${idToken}`,
      },
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


export const updateExcercise = async (inputs: iApiCallInterface) => {
  try {
    const idToken = getCookie("JwtToken");
    console.log("Inputs:", idToken);
    const response = await fetch(baseURL + "/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${idToken}`,
      },
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
    console.error("Error creating patient:", error);
  }
};

export const createExcercise = async (inputs: iApiCallInterface) => {
  try {
    const idToken = getCookie("JwtToken");
    console.log("Inputs:", idToken);
    const response = await fetch(baseURL + "/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${idToken}`,
      },
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
    console.error("Error creating patient:", error);
  }
};

export const deleteOriginalExcercise = async (inputs: iApiCallInterface) => {
  try {
    const idToken = getCookie("JwtToken");
    console.log("Inputs:", idToken);
    const response = await fetch(baseURL + "/deleteoriginal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${idToken}`,
      },
      // body: inputs.data as string
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
    console.error("Error creating patient:", error);
  }
};


export const saveExcercisePlan = async (inputs: iApiCallInterface) => {
  try {
    const idToken = getCookie("JwtToken");
    console.log("Inputs:", idToken);
    const response = await fetch(baseURL + "/saveexcerciseplan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${idToken}`,
      },
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
    console.error("Error creating patient:", error);
  }
};

export const getExcercisePlans = async (inputs: iApiCallInterface) => {
  try {
    const idToken = getCookie("JwtToken");
    const response = await fetch(baseURL + "/getallexcerciseplans", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${idToken}`,
      },
      body: JSON.stringify(inputs.data),
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