export interface DoctorDetails {
  name: string;
  age: number;
  country_code: string;
  phone_number: bigint;
  email: string;

  address: string;
  pincode: number;
  country: string;
  city: string;
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
