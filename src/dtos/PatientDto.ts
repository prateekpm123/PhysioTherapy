import { iExcercisePlanDto } from "../models/ExcerciseInterface";
import { BaseAPIDto } from "./BaseAPIDto";

export interface iPatientDto {
    d_id?: string;
    name: string;
    age: number;
    country_code: string;
    phone_number: number;
    email: string;
    address: string| null;
    chiefComplaint: string;
    description: string;
    patient_history: [];
}

export interface iPatientFullData extends iPatientDto{
    excercisePlans?: iExcercisePlanDto[]
}

export interface iGetAllPatientDto extends BaseAPIDto{
    patients: iPatientDto[]
}