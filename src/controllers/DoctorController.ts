import { FailedResponseDto } from "../dtos/FailedResponseDto";
import { iApiCallInterface } from "../models/iApiCallInterface";
import { DoctorDetails } from "../models/iDoctorDetails";
import { getCookie } from "../utils/cookies";

const baseURL = "http://localhost:3000/api/doctor";
const idToken = getCookie("JwtToken");

export const createDoctor = async ({
  data,
  afterAPISuccess,
  afterAPIFail,
}: iApiCallInterface) => {
  try {
    console.log("Inputs:", data);
    const response = await fetch(baseURL + "/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${idToken}`,
      },
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
  }
};
