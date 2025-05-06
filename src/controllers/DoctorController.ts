import { FailedResponseDto } from "../dtos/FailedResponseDto";
import { iApiCallInterface } from "../models/iApiCallInterface";
import { DoctorDetails } from "../models/iDoctorDetails";
import { getValidAuthToken } from "../utils/cookies";
import { backendUrl } from "../configDetails";
import { StatusAndErrorType } from "../models/StatusAndErrorType.enum";

const baseURL = `${backendUrl}/api/doctor`;

export const createDoctor = async ({
  data,
  afterAPISuccess,
  afterAPIFail,
}: iApiCallInterface) => {
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
      body: JSON.stringify(data as DoctorDetails),
    });
    if (response.ok) {
      const data = await response.json();
      afterAPISuccess(data);
    } else {
      const temp = await response.json();
      afterAPIFail(temp as FailedResponseDto);
    }
  } catch (error) {
    console.error("Error creating doctor:", error);
    afterAPIFail({
      message: "Failed to create doctor",
      statusCode: 500,
      errorCode: StatusAndErrorType.InternalError,
      errors: error
    });
  }
};

export const updateDoctor = async ({
  data,
  afterAPISuccess,
  afterAPIFail,
}: iApiCallInterface) => {
  try {
    const validToken = await getValidAuthToken();
    const doctorData = data as DoctorDetails; // Cast data to expected type

    // Assuming the update endpoint requires the doctor's ID (d_id)
    // If the ID isn't part of the form data, you might need to fetch it or structure the API differently
    // Or perhaps the backend identifies the doctor via the auth token.
    // For this example, let's assume the backend uses the token.

    const response = await fetch(baseURL + "/update", { // Assuming /update endpoint
      method: "PUT", // Use PUT or PATCH for updates
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${validToken}`,
      },
      credentials: 'include',
      mode: 'cors',
      body: JSON.stringify(doctorData),
    });

    if (response.ok) {
      const responseData = await response.json();
      // Assuming the API returns the updated doctor details or a success message
      afterAPISuccess(responseData); 
    } else {
      const errorData = await response.json();
      afterAPIFail(errorData as FailedResponseDto);
    }
  } catch (error) {
    console.error("Error updating doctor:", error);
    afterAPIFail({
      message: "Failed to update doctor profile",
      statusCode: 500,
      errorCode: StatusAndErrorType.InternalError, // Or a specific update error code
      errors: error
    });
  }
};
