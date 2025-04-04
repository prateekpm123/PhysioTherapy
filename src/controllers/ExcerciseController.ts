import { FailedResponseDto } from "../dtos/FailedResponseDto";
import { iApiCallInterface } from "../models/iApiCallInterface";
import { getCookie } from "../utils/cookies";
import { backendUrl } from "../configDetails";


const baseURL = `${backendUrl}/api/excercise`;

export const getAllExcercises = async (inputs: iApiCallInterface) => {
  try {
    const idToken = getCookie("JwtToken");
    console.log("Inputs:", idToken);
    const response = await fetch(baseURL + "/getall", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
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
        Authorization: `Bearer ${idToken}`,
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
        Authorization: `Bearer ${idToken}`,
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
        Authorization: `Bearer ${idToken}`,
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
        Authorization: `Bearer ${idToken}`,
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
        Authorization: `Bearer ${idToken}`,
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

export const getExcercisePlan = async (inputs: iApiCallInterface) => {
  try {
    const idToken = getCookie("JwtToken");
    const response = await fetch(baseURL + "/getexcerciseplan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
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


export const saveExcerciseCompletionData = async (inputs: iApiCallInterface) => {
  try {
    const idToken = getCookie("JwtToken");
    const response = await fetch(baseURL + "/createExcerciseCompletions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
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

export const saveExcercisePlanNotes = async (inputs: iApiCallInterface) => {
  try {
    const idToken = getCookie("JwtToken");
    const response = await fetch(baseURL + "/createExcercisePlanNotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
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

export const getExcerciseTrackingSessionData = async (inputs: iApiCallInterface) => {
  try {
    const idToken = getCookie("JwtToken");
    const response = await fetch(baseURL + "/getTrackingSession", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
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
