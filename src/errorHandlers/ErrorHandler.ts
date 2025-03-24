import { ToastColors } from "../components/Toast";
import { FailedResponseDto } from "../dtos/FailedResponseDto";
import { StatusAndErrorType } from "../models/StatusAndErrorType.enum";
import { DefaultToastTiming, useToast } from "../stores/ToastContext";

const ErrorHandler = (response: FailedResponseDto) => {
  const { showToast } = useToast();
  if (response.errorCode === StatusAndErrorType.UserAlreadyExists) {
    showToast(response.message, DefaultToastTiming, ToastColors.RED);
  } else if (response.errorCode === StatusAndErrorType.UserNotCreated) {
    showToast(response.message, DefaultToastTiming, ToastColors.RED);
  } else if (response.errorCode === StatusAndErrorType.Invalid) {
    showToast(response.message, DefaultToastTiming, ToastColors.RED);
  } else if (response.errorCode === StatusAndErrorType.Verified) {
    showToast(response.message, DefaultToastTiming, ToastColors.RED);
  } else if (response.errorCode === StatusAndErrorType.InternalError) {
    showToast(response.message, DefaultToastTiming, ToastColors.RED);
  } else if (response.errorCode === StatusAndErrorType.CookieNotFound) {
    showToast(response.message, DefaultToastTiming, ToastColors.RED);
  } else if (response.errorCode === StatusAndErrorType.PatientNotCreated) {
    showToast(response.message, DefaultToastTiming, ToastColors.RED);
  } else if (response.errorCode === StatusAndErrorType.PatientNotFound) {
    showToast(response.message, DefaultToastTiming, ToastColors.RED);
  } else if (response.errorCode === StatusAndErrorType.PatientNotUpdated) {
    showToast(response.message, DefaultToastTiming, ToastColors.RED);
  } else if (response.errorCode === StatusAndErrorType.PatientNotDeleted) {
    showToast(response.message, DefaultToastTiming, ToastColors.RED);
  } else if (response.errorCode === StatusAndErrorType.PatientAlreadyExists) {
    showToast(response.message, DefaultToastTiming, ToastColors.RED);
} else if (response.errorCode === StatusAndErrorType.PatientNotVerified) {
    showToast(response.message, DefaultToastTiming, ToastColors.RED);
} else if (response.errorCode === StatusAndErrorType.DoctorNotCreated) {
    showToast(response.message, DefaultToastTiming, ToastColors.RED);
} else if (response.errorCode === StatusAndErrorType.DoctorNotFound) {
    showToast(response.message, DefaultToastTiming, ToastColors.RED);
} else if (response.errorCode === StatusAndErrorType.DoctorNotUpdated) {
    showToast(response.message, DefaultToastTiming, ToastColors.RED);
} else if (response.errorCode === StatusAndErrorType.DoctorNotDeleted) {
    showToast(response.message, DefaultToastTiming, ToastColors.RED);
} else if (response.errorCode === StatusAndErrorType.DoctorAlreadyExists) {
    showToast(response.message, DefaultToastTiming, ToastColors.RED);
} else if (response.errorCode === StatusAndErrorType.Unauthorized) {
    showToast(response.message, DefaultToastTiming, ToastColors.RED);
  } else {
    showToast("Some Error occured");
    console.log("Some error occured");
  }
  console.log(response.message);
  console.log(response.errors);
  console.log(response.errorCode);
  return;
};

export default ErrorHandler;
