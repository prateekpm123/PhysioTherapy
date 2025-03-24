import React, { useState } from "react";
// import { Form } from '@radix-ui/themes';
// import { useToast, ToastColors } from '../../customHooks/useToast';
import * as Form from "@radix-ui/react-form";
// import ThemeColorPallate from "../../assets/ThemeColorPallate";
// import { useState } from "react";
import { DefaultToastTiming, useToast } from "../../stores/ToastContext";
import { ToastColors } from "../../components/Toast";
import iPatients from "../../models/iPatients";
import { createPatient } from "../../controllers/PatientsController";
import { FailedResponseDto } from "../../dtos/FailedResponseDto";
import { useSelector } from "react-redux";
import { UserSessionStateType } from "../../stores/userSessionStore";
import ErrorHandler from "../../errorHandlers/ErrorHandler";
// import { PatientListProps } from "./PatientLIst";

interface iNewPatientEntry {
  onSave: () => void;
}

const NewPatientEntry: React.FC<iNewPatientEntry> = ({ onSave }) => {
  // const userData = useSelector(
  //   (state: UserSessionStateType) => state.userSession.user
  // );
  const doctorData = useSelector(
    (state: UserSessionStateType) => state.userSession.doctorDetails
  );

  console.log("Doctor settings ", doctorData);
  const [formData, setFormData] = useState<iPatients>({
    patientName: "",
    patientAge: 0,
    chiefComplaint: "",
    additionalDescription: "",
    phoneNumber: "",
    email: "",
    address: "",
    fileUpload: [],
    doctorId: "",
  });
  const { showToast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, fileUpload: Array.from(e.target.files) });
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    formData.doctorId = doctorData.d_id || "";
    createPatient({
      data: formData,
      afterAPISuccess: onCreateSuccess,
      afterAPIFail: onCreateFail,
    });
    console.log("Collected Form Data:", formData);
  };

  const onCreateSuccess = () => {
    showToast(
      "Form submitted successfully",
      DefaultToastTiming,
      ToastColors.GREEN
    );
    onSave();
    console.log("Patient was created succesfully");
  };
  const onCreateFail = (response: FailedResponseDto) => {
    ErrorHandler(response);
  };

  return (
    <div className="p-6 mx-auto" style={{ width: "80%" }}>
      <h1 className="text-2xl font-bold mb-4">New Patient Entry</h1>
      <Form.Root className="space-y-4" onSubmit={handleSubmit}>
        {/* Patient Name */}
        <Form.Field name="patientName">
          <div className="flex flex-col">
            <Form.Label className="mb-1 font-medium">Patient Name</Form.Label>
            <Form.Control asChild>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
                placeholder="Enter patient name"
                required
              />
            </Form.Control>
          </div>
        </Form.Field>

        {/* Patient Age */}
        <Form.Field name="patientAge">
          <div className="flex flex-col">
            <Form.Label className="mb-1 font-medium">Patient Age</Form.Label>
            <Form.Control asChild>
              <input
                type="number"
                name="patientAge"
                value={formData.patientAge}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
                placeholder="Enter patient age"
                required
              />
            </Form.Control>
          </div>
        </Form.Field>

        {/* Chief Complaint */}
        <Form.Field name="chiefComplaint">
          <div className="flex flex-col">
            <Form.Label className="mb-1 font-medium">
              Chief Complaint
            </Form.Label>
            <Form.Control asChild>
              <textarea
                name="chiefComplaint"
                value={formData.chiefComplaint}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
                placeholder="Enter chief complaint"
                rows={4}
                required
              />
            </Form.Control>
          </div>
        </Form.Field>

        {/* Additional Description */}
        <Form.Field name="additionalDescription">
          <div className="flex flex-col">
            <Form.Label className="mb-1 font-medium">
              Additional Description
            </Form.Label>
            <Form.Control asChild>
              <textarea
                name="additionalDescription"
                value={formData.additionalDescription}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
                placeholder="Enter additional description"
                rows={3}
              />
            </Form.Control>
          </div>
        </Form.Field>

        {/* Phone Number */}
        <Form.Field name="phoneNumber">
          <div className="flex flex-col">
            <Form.Label className="mb-1 font-medium">Phone Number</Form.Label>
            <div className="flex">
              <select
                name="phoneNumber"
                value={formData.phoneNumber}
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
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="border rounded-r px-3 py-2 w-full"
                  placeholder="Enter phone number"
                  required
                />
              </Form.Control>
            </div>
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
          </div>
        </Form.Field>

        {/* Address */}
        <Form.Field name="address">
          <div className="flex flex-col">
            <Form.Label className="mb-1 font-medium">Address</Form.Label>
            <Form.Control asChild>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
                placeholder="Enter address"
                rows={3}
                required
              />
            </Form.Control>
          </div>
        </Form.Field>

        {/* Upload PDF/Images */}
        <Form.Field name="fileUpload">
          <div className="flex flex-col">
            <Form.Label className="mb-1 font-medium">
              Upload PDF/Images
            </Form.Label>
            <Form.Control asChild>
              <input
                type="file"
                name="fileUpload"
                onChange={handleFileChange}
                className="border rounded px-3 py-2 w-full"
                accept=".pdf, image/*"
                multiple
              />
            </Form.Control>
          </div>
        </Form.Field>

        {/* Submit Button */}
        <Form.Submit asChild>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Submit
          </button>
        </Form.Submit>
      </Form.Root>
    </div>
  );
};

export default NewPatientEntry;
