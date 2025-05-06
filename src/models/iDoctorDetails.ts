export interface DoctorDetails {
  name: string;
  age: number;
  country_code: string;
  phone_number: bigint;
  email: string;

  address: Address;
  pincode: number;
  country: string;
  district: string;
  state: string;

  role: string;
  user_id: string;
  doctor_history: string;
  doctor_specialization: string;
  doctor_qualification: string;
  doctor_experience: string;
  doctor_awards: string;
  doctor_certification: string;
  d_id?: string;
}

export interface Address {
  address_line1: string;
  address_line2?: string;
  pincode: number;
  flat_no?: number;
  district: string;
  state: string;
  country: string;
}