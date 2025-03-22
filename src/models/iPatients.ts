interface iPatients {
    patientName: string,
    patientAge: number,
    chiefComplaint: string,
    additionalDescription: string,
    phoneNumber: string
    email: string
    address: string
    fileUpload: File[]
}

// interface iPhoneNumber {
//     countryCode: string,
//     phoneNumber: number
// }

export default iPatients;