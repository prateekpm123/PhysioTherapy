import React, { useState } from "react";
import * as Form from "@radix-ui/react-form";
// import { DefaultToastTiming, useToast } from "../../stores/ToastContext";
// import { ToastColors } from "../../components/Toast";
// import { createDoctor } from "../../controllers/DoctorsController";
// import { FailedResponseDto } from "../../dtos/FailedResponseDto";
// import { StatusAndErrorType } from "../../models/StatusAndErrorType.enum";
import { useNavigate } from "react-router-dom";
import { ToastColors } from "../components/Toast";
import { FailedResponseDto } from "../dtos/FailedResponseDto";
import { StatusAndErrorType } from "../models/StatusAndErrorType.enum";
import { useToast, DefaultToastTiming } from "../stores/ToastContext";
import { createDoctor } from "../controllers/DoctorController";
import { Flex } from "@radix-ui/themes";
import { UserSessionStateType } from "../stores/userSessionStore";
import { useDispatch, useSelector } from "react-redux";
import { setDoctorDetails } from "../stores/userSessionSlice";
import { DoctorDetails as iDoctorDetails } from "../models/iDoctorDetails";
import { styled } from "@stitches/react";

// Add styled component for error messages
const ErrorMessage = styled("span", {
  color: "red",
  fontSize: "0.8rem",
  marginTop: "4px",
  display: "block",
});

interface DoctorDetailsProps {
  onSave?: () => void;
}

// Add validation interface
interface ValidationErrors {
  name?: string;
  age?: string;
  phone_number?: string;
  email?: string;
  country?: string;
  district?: string;
  state?: string;
  pincode?: string;
  doctor_specialization?: string;
  doctor_qualification?: string;
}

// Add type for form fields that need validation
type ValidatableFields = 'name' | 'age' | 'phone_number' | 'email' | 'country' | 'district' | 'state' | 'pincode' | 'doctor_specialization' | 'doctor_qualification';

const DoctorDetails: React.FC<DoctorDetailsProps> = ({ onSave }) => {
  const navigate = useNavigate();
  const doctorData = useSelector(
    (state: UserSessionStateType) => state.userSession.user
  );
  const [formData, setFormData] = useState({  // @todo since I have some data already from email account, I should prefill that.
    name: doctorData.name,
    age: 0,
    country_code: "+91",
    phone_number: "",
    email: doctorData.email,
    address: "",
    district: "",
    pincode: "",
    state:"",
    country: "",
    doctor_history: "",
    doctor_specialization: "",
    doctor_qualification: "",
    doctor_experience: "",
    doctor_awards: "",
    doctor_certification: "",
    user_id: doctorData.uid
  });
  // const [formData, setFormData] = useState({} as DoctorDetailsProps);
  const dispatch = useDispatch();
  const { showToast } = useToast();
  
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const validateField = (name: ValidatableFields, value: string | number) => {
    let error = "";
    
    switch (name) {
      case "name":
        if (!value) error = "Name is required";
        else if (typeof value === "string" && value.length < 2) error = "Name must be at least 2 characters";
        else if (typeof value === "string" && value.length > 200) error = "Name must be at max 200 characters";
        break;
      case "age":
        if (!value) error = "Age is required";
        else if (Number(value) < 0 || Number(value) > 150) error = "Age must be between 0 and 150";
        break;
      case "phone_number":
        if (!value) error = "Phone number is required";
        else if (!/^\d{10}$/.test(value as string)) error = "Please enter a valid 10-digit phone number";
        break;
      case "email":
        if (!value) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string)) error = "Please enter a valid email address";
        break;
      case "country":
        if (!value) error = "Country is required";
        else if (typeof value === "string" && value.length < 2) error = "Please enter a valid country name";
        break;
      case "district":
        if (!value) error = "City is required";
        else if (typeof value === "string" && value.length < 2) error = "Please enter a valid district name";
        break;
      case "state":
        if (!value) error = "State is required";
        else if (typeof value === "string" && value.length < 2) error = "Please enter a valid state name";
        break;
      case "pincode":
        if (!value) error = "Pincode is required";
        else if (!/^\d{6}$/.test(value as string)) error = "Please enter a valid 6-digit pincode";
        break;
      case "doctor_specialization":
        if (!value) error = "Specialization is required";
        else if (typeof value === "string" && value.length < 3) error = "Please enter a valid specialization";
        break;
      case "doctor_qualification":
        if (!value) error = "Qualification is required";
        else if (typeof value === "string" && value.length < 3) error = "Please enter a valid qualification";
        break;
    }
    
    return error;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Validate the field and update validation errors
    if (name in validationErrors) {
      const error = validateField(name as ValidatableFields, value);
      setValidationErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    // Validate all fields before submission
    const errors: ValidationErrors = {};
    const validatableFields: ValidatableFields[] = [
      'name', 'age', 'phone_number', 'email', 'country', 
      'district', 'state', 'pincode', 'doctor_specialization', 
      'doctor_qualification'
    ];
    
    validatableFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) errors[field] = error;
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      showToast("Please correct the errors in the form", DefaultToastTiming, ToastColors.RED);
      return;
    }

    setFormData({ ...formData, user_id: doctorData.uid });
    createDoctor({
      data: formData,
      afterAPISuccess: onCreateSuccess,
      afterAPIFail: onCreateFail,
    });
    console.log("Collected Form Data:", formData);
  };

  const onCreateSuccess = (data: { Doctor: iDoctorDetails; }) => {
    // @todo when first time logging in, the screens are not loading properly.
    showToast(
      "Doctor details submitted successfully",
      DefaultToastTiming,
      ToastColors.GREEN
    );
    dispatch(setDoctorDetails(data.Doctor));
    if (onSave) {
    
      onSave();
    } else {
      navigate("/doctorhome/main/newPatient");
    }
    console.log("Doctor details were created successfully");
  };

  const onCreateFail = (response: FailedResponseDto) => {
    if (response.errorCode === StatusAndErrorType.DoctorNotCreated) {
      showToast(
        "Doctor details were not saved",
        DefaultToastTiming,
        ToastColors.RED
      );
      console.log("Doctor details were not created");
    } else if (response.errorCode === StatusAndErrorType.Unauthorized) {
      showToast(
        "Your session has expired, log in again",
        10000,
        ToastColors.RED
      );
    } else {
      showToast("Doctor details were not saved");
      console.log("Some error occurred");
    }
  };

  return (
    <div className="p-6 mx-auto" style={{ width: "80%" }}>
      <h1 className="text-2xl font-bold mb-4">Doctor Details</h1>
      <Form.Root className="space-y-4" onSubmit={handleSubmit}>
        {/* Name */}
        <Form.Field name="name">
          <div className="flex flex-col">
            <Form.Label className="mb-1 font-medium">Name</Form.Label>
            <Form.Control asChild>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
                placeholder="Enter doctor name"
                required
              />
            </Form.Control>
            {validationErrors.name && (
              <ErrorMessage>{validationErrors.name}</ErrorMessage>
            )}
          </div>
        </Form.Field>

        {/* Age */}
        <Form.Field name="age">
          <div className="flex flex-col">
            <Form.Label className="mb-1 font-medium">Age</Form.Label>
            <Form.Control asChild>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
                placeholder="Enter doctor age"
                required
              />
            </Form.Control>
            {validationErrors.age && (
              <ErrorMessage>{validationErrors.age}</ErrorMessage>
            )}
          </div>
        </Form.Field>

        {/* Phone Number */}
        <Form.Field name="phone_number">
          <div className="flex flex-col">
            <Form.Label className="mb-1 font-medium">Phone Number</Form.Label>
            <div className="flex">
              <select
                name="country_code"
                value={formData.country_code}
                onChange={handleChange}
                className="border rounded-l px-3 py-2"
                defaultValue="+91"
              >
                <option value="+91">+91 (India)</option>
                <option value="+1">+1 (USA)</option>
                <option value="+44">+44 (UK)</option>
                {/* Add more country codes as needed */}
              </select>
              <Form.Control asChild>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="border rounded-r px-3 py-2 w-full"
                  placeholder="Enter phone number"
                  required
                />
              </Form.Control>
            </div>
            {validationErrors.phone_number && (
              <ErrorMessage>{validationErrors.phone_number}</ErrorMessage>
            )}
          </div>
        </Form.Field>

        {/* Email */}
        <Form.Field name="email">
          <div className="flex flex-col">
            <Form.Label className="mb-1 font-medium">Email</Form.Label>
            <Form.Control asChild>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
                placeholder="Enter email address"
                required
              />
            </Form.Control>
            {validationErrors.email && (
              <ErrorMessage>{validationErrors.email}</ErrorMessage>
            )}
          </div>
        </Form.Field>

        <Flex direction="row" gap="2" style={{ width: "100%" }}>
          <Flex direction="column" gap="2" style={{ width: "100%" }}>
            {/* Country */}
            <Form.Field name="country">
              <div className="flex flex-col">
                <Form.Label className="mb-1 font-medium">Country</Form.Label>
                <Form.Control asChild>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="border rounded px-3 py-2 w-full"
                    placeholder="Enter country"
                    required
                  />
                </Form.Control>
                {validationErrors.country && (
                  <ErrorMessage>{validationErrors.country}</ErrorMessage>
                )}
              </div>
            </Form.Field>

            {/* Pincode */}
            <Form.Field name="pincode">
              <div className="flex flex-col">
                <Form.Label className="mb-1 font-medium">Pincode</Form.Label>
                <Form.Control asChild>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="border rounded px-3 py-2 w-full"
                    placeholder="Enter pincode"
                    required
                  />
                </Form.Control>
                {validationErrors.pincode && (
                  <ErrorMessage>{validationErrors.pincode}</ErrorMessage>
                )}
              </div>
            </Form.Field>
          </Flex>
          <Flex direction="column" gap="2" style={{ width: "100%" }}>
            {/* City */}
            <Form.Field name="district">
              <div className="flex flex-col">
                <Form.Label className="mb-1 font-medium">City</Form.Label>
                <Form.Control asChild>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="border rounded px-3 py-2 w-full"
                    placeholder="Enter district"
                    required
                  />
                </Form.Control>
                {validationErrors.district && (
                  <ErrorMessage>{validationErrors.district}</ErrorMessage>
                )}
              </div>
            </Form.Field>

            {/* State */}
            <Form.Field name="state">
              <div className="flex flex-col">
                <Form.Label className="mb-1 font-medium">State</Form.Label>
                <Form.Control asChild>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="border rounded px-3 py-2 w-full"
                    placeholder="Enter state"
                    required
                  />
                </Form.Control>
                {validationErrors.state && (
                  <ErrorMessage>{validationErrors.state}</ErrorMessage>
                )}
              </div>
            </Form.Field>
          </Flex>
        </Flex>
        <Form.Field name="address">
          <div className="flex flex-col">
            <Form.Label className="mb-1 font-medium">
              Address <span style={{ color: "grey" }}>{"( Optional )"}</span>
            </Form.Label>
            <Form.Control asChild>
              <textarea
                name="address"
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
                placeholder="Enter address"
                rows={3}
              />
            </Form.Control>
          </div>
        </Form.Field>

        {/* Doctor History */}
        <Form.Field name="doctor_history">
          <div className="flex flex-col">
            <Form.Label className="mb-1 font-medium">Doctor History</Form.Label>
            <Form.Control asChild>
              <textarea
                name="doctor_history"
                value={formData.doctor_history}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
                placeholder="Enter doctor history"
                rows={3}
              />
            </Form.Control>
          </div>
        </Form.Field>

        {/* Doctor Specialization */}
        <Form.Field name="doctor_specialization">
          <div className="flex flex-col">
            <Form.Label className="mb-1 font-medium">
              Doctor Specialization
            </Form.Label>
            <Form.Control asChild>
              <input
                type="text"
                name="doctor_specialization"
                value={formData.doctor_specialization}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
                placeholder="Enter doctor specialization"
                required
              />
            </Form.Control>
            {validationErrors.doctor_specialization && (
              <ErrorMessage>{validationErrors.doctor_specialization}</ErrorMessage>
            )}
          </div>
        </Form.Field>

        {/* Doctor Qualification */}
        <Form.Field name="doctor_qualification">
          <div className="flex flex-col">
            <Form.Label className="mb-1 font-medium">
              Doctor Qualification
            </Form.Label>
            <Form.Control asChild>
              <input
                type="text"
                name="doctor_qualification"
                value={formData.doctor_qualification}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
                placeholder="Enter doctor qualification"
                required
              />
            </Form.Control>
            {validationErrors.doctor_qualification && (
              <ErrorMessage>{validationErrors.doctor_qualification}</ErrorMessage>
            )}
          </div>
        </Form.Field>

        {/* Doctor Experience */}
        <Form.Field name="doctor_experience">
          <div className="flex flex-col">
            <Form.Label className="mb-1 font-medium">
              Doctor Experience
            </Form.Label>
            <Form.Control asChild>
              <textarea
                name="doctor_experience"
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
                placeholder="Enter doctor experience"
                rows={3}
              />
            </Form.Control>
          </div>
        </Form.Field>

        {/* Doctor Awards */}
        <Form.Field name="doctor_awards">
          <div className="flex flex-col">
            <Form.Label className="mb-1 font-medium">Doctor Awards</Form.Label>
            <Form.Control asChild>
              <textarea
                name="doctor_awards"
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
                placeholder="Enter doctor awards"
                rows={3}
              />
            </Form.Control>
          </div>
        </Form.Field>

        {/* Doctor Certification */}
        <Form.Field name="doctor_certification">
          <div className="flex flex-col">
            <Form.Label className="mb-1 font-medium">
              Doctor Certification
            </Form.Label>
            <Form.Control asChild>
              <textarea
                name="doctor_certification"
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
                placeholder="Enter doctor certification"
                rows={3}
              />
            </Form.Control>
          </div>
        </Form.Field>
        <Form.Submit asChild >
          <button className="bg-blue-500 text-white px-4 py-2 w-1/3 rounded hover:bg-blue-600">
            Submit
          </button>
        </Form.Submit>
      </Form.Root>
    </div>
  );
};

export default DoctorDetails;
