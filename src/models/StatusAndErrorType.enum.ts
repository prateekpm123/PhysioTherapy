export enum StatusAndErrorType {
    UserAlreadyExists = 1001,
    UserNotCreated = 1002,
    Unauthorized = 1003,
    Invalid = 1004,
    Verified = 1005,
    InternalError = 2001,
    CookieNotFound = 3001,
    PatientNotCreated = 4001,
    PatientNotFound = 4002,
    PatientNotUpdated = 4003,
    PatientNotDeleted = 4004,
    PatientAlreadyExists = 4005,
    PatientNotVerified = 4006,
    DoctorNotCreated = 5001,
    DoctorNotFound = 5002,
    DoctorNotUpdated = 5003,
    DoctorNotDeleted = 5004,
    DoctorAlreadyExists = 5005,
    DoctorNotVerified = 5006,
    ExcercisePlanNotCreated = 6001,
    ExcercisePlanNotFound = 6002,
    ExcercisePlanNotUpdated = 6003,
    ExcercisePlanNotDeleted = 6004,
    ExcercisePlanAlreadyExists = 6005,
}