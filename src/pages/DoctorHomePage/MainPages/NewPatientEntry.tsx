import React, { useState } from "react";
// import { Form } from '@radix-ui/themes';
// import { useToast, ToastColors } from '../../customHooks/useToast';
import * as Form from "@radix-ui/react-form";
// import ThemeColorPallate from "../../assets/ThemeColorPallate";
// import { useState } from "react";
import { DefaultToastTiming, useToast } from "../../../stores/ToastContext";
import { ToastColors } from "../../../components/Toast";
import iPatients from "../../../models/iPatients";
import { createPatient } from "../../../controllers/PatientsController";
import { FailedResponseDto } from "../../../dtos/FailedResponseDto";
import { useSelector } from "react-redux";
import { UserSessionStateType } from "../../../stores/userSessionStore";
// import ErrorHandler from "../../../errorHandlers/ErrorHandler";
import { useCurrentMainScreenContext } from "../DoctorHomePage";
import { useNavigate } from "react-router-dom";
import { iPatientDto } from "../../../dtos/PatientDto";
// import { PatientListProps } from "./PatientLIst";
import { styled } from "@stitches/react";
import { themeColors, spacing, theme } from "../../../theme/theme";
import { ScrollArea } from "@radix-ui/themes"; // Import ScrollArea

// interface iNewPatientEntry {
//   onSave: () => void;
// }

// --- Styled Components --- //

const FormContainer = styled("div", {
  padding: spacing.lg,
  backgroundColor: themeColors.background.dark,
  borderRadius: theme.radius[3],
  margin: "auto",
  maxWidth: "800px", // Max width for larger screens
  width: "100%",

  "@media (max-width: 768px)": {
    padding: spacing.md,
    maxWidth: "100%", // Full width on mobile
    margin: 0,
    borderRadius: 0,
  },
});

const FormTitle = styled("h1", {
  color: themeColors.text.primary,
  fontSize: "1.75rem", // Slightly larger title
  fontWeight: "600",
  marginBottom: spacing.lg,
  textAlign: "center", // Center title

  "@media (max-width: 768px)": {
    fontSize: "1.5rem",
    marginBottom: spacing.md,
  },
});

const StyledFormField = styled(Form.Field, {
  marginBottom: spacing.md,
});

const FieldLabel = styled(Form.Label, {
  display: "block",
  color: themeColors.text.secondary,
  marginBottom: spacing.xs,
  fontSize: "0.9rem",
  fontWeight: "500",
});

const BaseInputStyles = {
  width: "100%",
  padding: spacing.sm,
  backgroundColor: themeColors.background.elevation1,
  border: `1px solid ${themeColors.background.elevation3}`,
  borderRadius: theme.radius[2],
  color: themeColors.text.primary,
  fontSize: "1rem",
  "&::placeholder": {
    color: themeColors.text.disabled,
  },
  "&:focus": {
    outline: "none",
    borderColor: themeColors.primary[500],
    boxShadow: `0 0 0 1px ${themeColors.primary[500]}`,
  },
  "@media (max-width: 768px)": {
    padding: spacing.xs,
    fontSize: "0.9rem",
  },
};

const Input = styled("input", BaseInputStyles);
const TextArea = styled("textarea", {
  ...BaseInputStyles,
  resize: "vertical",
  minHeight: "80px",
});
const Select = styled("select", BaseInputStyles);

const PhoneInputContainer = styled("div", {
  display: "flex",
  gap: spacing.xs,
});

const CountryCodeSelect = styled(Select, {
  flexShrink: 0,
  width: "auto", // Adjust width as needed
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
});

const PhoneNumberInput = styled(Input, {
  flexGrow: 1,
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
});

const FileInput = styled(Input, {
  padding: spacing.xs, // Adjust padding for file input
});

const SubmitButton = styled("button", {
  width: "100%",
  padding: spacing.md,
  backgroundColor: themeColors.primary[500],
  color: "white",
  border: "none",
  borderRadius: theme.radius[2],
  fontSize: "1.1rem",
  fontWeight: "600",
  cursor: "pointer",
  transition: "background-color 0.2s ease",
  marginTop: spacing.lg,

  "&:hover": {
    backgroundColor: themeColors.primary[600],
  },
  "&:disabled": {
    backgroundColor: themeColors.background.elevation3,
    cursor: "not-allowed",
  },

  "@media (max-width: 768px)": {
    fontSize: "1rem",
    padding: spacing.sm,
    marginTop: spacing.md,
    // Optional: Make sticky at the bottom on mobile
    // position: 'sticky',
    // bottom: spacing.md,
  },
});

// --- Component Logic --- //

const NewPatientEntry = () => {
  // const userData = useSelector(
  //   (state: UserSessionStateType) => state.userSession.user
  // );
  const doctorData = useSelector(
    (state: UserSessionStateType) => state.userSession.doctorDetails
  );

  const {
    setIsPatientListScreenRefresh,
    isPatientListScreenRefresh,
    setCurrentPatientDetails,
  } = useCurrentMainScreenContext();

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
  const navigate = useNavigate();
  const [countryCode, setCountryCode] = useState("+91"); // State for country code
  const [isSubmitting, setIsSubmitting] = useState(false); // Submission state

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
    try {
      event.preventDefault();
      if (isSubmitting) return; // Prevent multiple submissions

      setIsSubmitting(true);
      // Combine country code and phone number
      const fullPhoneNumber = countryCode + formData.phoneNumber;

      createPatient({
        data: {
          ...formData,
          phoneNumber: fullPhoneNumber,
          doctorId: doctorData.d_id || "",
        },
        afterAPISuccess: onCreateSuccess,
        afterAPIFail: onCreateFail,
      });
      console.log("Collected Form Data:", {
        ...formData,
        phoneNumber: fullPhoneNumber,
      });
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error creating patient:", error);
    }
  };

  const onCreateSuccess = async (data: iPatientDto) => {
    setIsSubmitting(false);
    showToast(
      "Form submitted successfully",
      DefaultToastTiming,
      ToastColors.GREEN
    );
    navigate("/doctorhome/main/patientDetails/" + data.p_id);
    if (setCurrentPatientDetails) setCurrentPatientDetails(data);
    setIsPatientListScreenRefresh(!isPatientListScreenRefresh);
    console.log("Patient was created succesfully");
  };
  const onCreateFail = (response: FailedResponseDto) => {
    setIsSubmitting(false);
    showToast(response.message, DefaultToastTiming, ToastColors.RED);
  };

  return (
    // Use ScrollArea for better scrolling control
    <ScrollArea style={{ height: "calc(100vh - 60px)" }}>
      <FormContainer>
        <FormTitle>New Patient Entry</FormTitle>
        <Form.Root onSubmit={handleSubmit}>
          {/* Patient Name */}
          <StyledFormField name="patientName">
            <FieldLabel>Patient Name</FieldLabel>
            <Form.Control asChild>
              <Input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                placeholder="Enter patient name"
                required
              />
            </Form.Control>
          </StyledFormField>

          {/* Patient Age */}
          <StyledFormField name="patientAge">
            <FieldLabel>Patient Age</FieldLabel>
            <Form.Control asChild>
              <Input
                type="number"
                name="patientAge"
                value={formData.patientAge === 0 ? "" : formData.patientAge} // Handle initial 0 value
                onChange={handleChange}
                placeholder="Enter patient age"
                required
              />
            </Form.Control>
          </StyledFormField>

          {/* Chief Complaint */}
          <StyledFormField name="chiefComplaint">
            <FieldLabel>Chief Complaint</FieldLabel>
            <Form.Control asChild>
              <TextArea
                name="chiefComplaint"
                value={formData.chiefComplaint}
                onChange={handleChange}
                placeholder="Enter chief complaint"
                rows={4}
                required
              />
            </Form.Control>
          </StyledFormField>

          {/* Additional Description */}
          <StyledFormField name="additionalDescription">
            <FieldLabel>Additional Description</FieldLabel>
            <Form.Control asChild>
              <TextArea
                name="additionalDescription"
                value={formData.additionalDescription}
                onChange={handleChange}
                placeholder="Enter additional description"
                rows={3}
              />
            </Form.Control>
          </StyledFormField>

          {/* Phone Number */}
          <StyledFormField name="phoneNumber">
            <FieldLabel>Phone Number</FieldLabel>
            <PhoneInputContainer>
              <CountryCodeSelect
                name="countryCode"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
              >
                <option value="+91">+91 (India)</option>
                <option value="+1">+1 (USA)</option>
                <option value="+44">+44 (UK)</option>
                {/* Add more country codes as needed */}
              </CountryCodeSelect>
              <Form.Control asChild>
                <PhoneNumberInput
                  type="tel"
                  name="phoneNumber"
                  pattern="[0-9]{10}" // Basic 10-digit pattern
                  title="Please enter a 10-digit phone number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter 10-digit number"
                  required
                />
              </Form.Control>
            </PhoneInputContainer>
          </StyledFormField>

          {/* Email */}
          <StyledFormField name="email">
            <FieldLabel>Email</FieldLabel>
            <Form.Control asChild>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
              />
            </Form.Control>
          </StyledFormField>

          {/* Address */}
          <StyledFormField name="address">
            <FieldLabel>Address</FieldLabel>
            <Form.Control asChild>
              <TextArea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                rows={3}
                required
              />
            </Form.Control>
          </StyledFormField>

          {/* Upload PDF/Images */}
          <StyledFormField name="fileUpload">
            <FieldLabel>Upload Documents (PDF/Images)</FieldLabel>
            <Form.Control asChild>
              <FileInput
                type="file"
                name="fileUpload"
                onChange={handleFileChange}
                accept=".pdf, image/*"
                multiple
              />
            </Form.Control>
          </StyledFormField>

          {/* Submit Button */}
          <Form.Submit asChild>
            <SubmitButton disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Patient Data"}
            </SubmitButton>
          </Form.Submit>
        </Form.Root>
      </FormContainer>
    </ScrollArea>
  );
};

export default NewPatientEntry;
