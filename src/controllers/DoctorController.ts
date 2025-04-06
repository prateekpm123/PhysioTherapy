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
