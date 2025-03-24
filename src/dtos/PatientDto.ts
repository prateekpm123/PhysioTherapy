import { BaseAPIDto } from "./BaseAPIDto";

export interface iPatientDto {
    d_id?: string;
    name: string;
    age: number;
    country_code: string;
    phone_number: number;
    email: string;
    address_id: string| null;
    chiefComplaint: string;
    description: string;
    patient_history: [];
}

export interface iGetAllPatientDto extends BaseAPIDto{
    patients: iPatientDto[]
}