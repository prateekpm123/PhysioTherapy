import { useEffect } from "react";
import { ToastColors } from "../components/Toast";
import { FailedResponseDto } from "../dtos/FailedResponseDto";
// import { StatusAndErrorType } from "../models/StatusAndErrorType.enum";
import { DefaultToastTiming } from "../stores/ToastContext";
import { useToast } from "../stores/ToastContext";
import React from "react";

interface ErrorHandlerProps {
  response: FailedResponseDto;
}

const ErrorHandler:React.FC<ErrorHandlerProps> = ({response}) => {
  const { showToast } = useToast();

  useEffect(()=> {
    showToast(response.message, DefaultToastTiming, ToastColors.RED);
  }, [response, showToast])


//   if (response.errorCode === StatusAndErrorType.UserAlreadyExists) {
//     showToast(response.message, DefaultToastTiming, ToastColors.RED);
//   } else if (response.errorCode === StatusAndErrorType.UserNotCreated) {
//     showToast(response.message, DefaultToastTiming, ToastColors.RED);
//   } else if (response.errorCode === StatusAndErrorType.Invalid) {
//     showToast(response.message, DefaultToastTiming, ToastColors.RED);
//   } else if (response.errorCode === StatusAndErrorType.Verified) {
//     showToast(response.message, DefaultToastTiming, ToastColors.RED);
//   } else if (response.errorCode === StatusAndErrorType.InternalError) {
//     showToast(response.message, DefaultToastTiming, ToastColors.RED);
//   } else if (response.errorCode === StatusAndErrorType.CookieNotFound) {
//     showToast(response.message, DefaultToastTiming, ToastColors.RED);
//   } else if (response.errorCode === StatusAndErrorType.PatientNotCreated) {
//     showToast(response.message, DefaultToastTiming, ToastColors.RED);
//   } else if (response.errorCode === StatusAndErrorType.PatientNotFound) {
//     showToast(response.message, DefaultToastTiming, ToastColors.RED);
//   } else if (response.errorCode === StatusAndErrorType.PatientNotUpdated) {
//     showToast(response.message, DefaultToastTiming, ToastColors.RED);
//   } else if (response.errorCode === StatusAndErrorType.PatientNotDeleted) {
//     showToast(response.message, DefaultToastTiming, ToastColors.RED);
//   } else if (response.errorCode === StatusAndErrorType.PatientAlreadyExists) {
//     showToast(response.message, DefaultToastTiming, ToastColors.RED);
// } else if (response.errorCode === StatusAndErrorType.PatientNotVerified) {
//     showToast(response.message, DefaultToastTiming, ToastColors.RED);
// } else if (response.errorCode === StatusAndErrorType.DoctorNotCreated) {
//     showToast(response.message, DefaultToastTiming, ToastColors.RED);
// } else if (response.errorCode === StatusAndErrorType.DoctorNotFound) {
//     showToast(response.message, DefaultToastTiming, ToastColors.RED);
// } else if (response.errorCode === StatusAndErrorType.DoctorNotUpdated) {
//     showToast(response.message, DefaultToastTiming, ToastColors.RED);
// } else if (response.errorCode === StatusAndErrorType.DoctorNotDeleted) {
//     showToast(response.message, DefaultToastTiming, ToastColors.RED);
// } else if (response.errorCode === StatusAndErrorType.DoctorAlreadyExists) {
//     showToast(response.message, DefaultToastTiming, ToastColors.RED);
// } else if (response.errorCode === StatusAndErrorType.Unauthorized) {
//     showToast(response.message, DefaultToastTiming, ToastColors.RED);
//   } else {
//     showToast("Some Error occured");
//     console.log("Some error occured");
//   }

  console.log(response.message);
  console.log(response.errors);
  console.log(response.errorCode);
  return null;
};

export default ErrorHandler;


// import React from 'react';

// export const ToastErrorHandler = ({ error }) => {
//   const {showToast} = useToast();

//   React.useEffect(() => {
//     show({
//       title: 'An error occurred.',
//       description: error.message,
//       status: 'error',
//       duration: 5000,
//       isClosable: true,
//     });
//   }, [error, toast]); // Depend on error and toast

//   return null; // This component doesn't render anything
// };

// export const ToastErrorHandler: React.FC<ToastErrorHandlerProps> = ({ errorMessage }) => {
//   const { showToast } = useToast();

//   useEffect(() => {
//     showToast(errorMessage, 5000, 'red'); // Adjust duration and color as needed
//   }, [errorMessage, showToast]);

//   return null; // This component doesn't render anything visible
// };
