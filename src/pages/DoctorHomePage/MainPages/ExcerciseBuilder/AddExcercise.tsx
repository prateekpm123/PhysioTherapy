/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { iExcerciseData } from "../../../../models/ExcerciseInterface";
// import DatabaseController from "../databaseConnections/DatabaseController";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../databaseConnections/FireBaseConnection";
// import { storage } from "../databaseConnections/FireBaseStorageInstance";
import { isMobile } from "react-device-detect";
import { Flex, Heading, Text, Button, ScrollArea } from "@radix-ui/themes";
import { createExcercise } from "../../../../controllers/ExcerciseController";
// import { IoMdAdd } from "react-icons/io";
import { useSelector } from "react-redux";
import { UserSessionStateType } from "../../../../stores/userSessionStore";
import { useCurrentMainScreenContext } from "../../DoctorHomePage";
// import ThemeColorPallate from "../../../../assets/ThemeColorPallate";
import Modal from "./TestModal";
import { themeColors, spacing, theme } from "../../../../theme/theme";
import { styled } from "@stitches/react";
import TagInput from "../../../../components/TagInputs";
import NumberComponent from "../../../../components/NumberComonent";
import { useToast } from "../../../../stores/ToastContext";
import { ToastColors } from "../../../../components/Toast";
import { useNavigate, useParams } from "react-router-dom";

// --- Styled Components (Adapted from NewPatientEntry.tsx) --- //

// Base Input Styles (shared styles for inputs/textareas)
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
  // Add margin-bottom for consistent spacing within form fields
  marginBottom: spacing.sm,
};

// Specific styled components
const StyledFormField = styled("div", {
  // Changed from Form.Field for simplicity here
  marginBottom: spacing.md,
});

const FieldLabel = styled(Text, {
  // Use Radix Text for consistency
  display: "block",
  color: themeColors.text.secondary,
  marginBottom: spacing.xs,
  fontSize: "0.9rem", // Match NewPatientEntry
  fontWeight: "500", // Match NewPatientEntry
});

const Input = styled("input", BaseInputStyles);
const TextArea = styled("textarea", {
  ...BaseInputStyles,
  resize: "vertical",
  minHeight: "80px", // Default height
});

const FileInput = styled("input", {
  ...BaseInputStyles, // Apply base styles
  padding: spacing.xs, // Adjust padding specifically for file input
  // Add specific file input styling if needed
  backgroundColor: themeColors.background.elevation1, // Ensure background matches
  border: `1px solid ${themeColors.background.elevation3}`, // Ensure border matches
  color: themeColors.text.primary, // Ensure text color matches
  cursor: "pointer",
  "::file-selector-button": {
    // Style the button part
    padding: `${spacing.xs} ${spacing.sm}`,
    marginRight: spacing.sm,
    backgroundColor: themeColors.primary[500],
    color: "white",
    border: "none",
    borderRadius: theme.radius[1],
    cursor: "pointer",
    "&:hover": {
      backgroundColor: themeColors.primary[600],
    },
  },
});

const StyledButton = styled(Button, {
  // Style Radix Button
  width: "100%", // Full width by default
  padding: spacing.sm, // Use theme spacing
  fontSize: "1rem", // Match input font size
  fontWeight: "600", // Match NewPatientEntry submit
  cursor: "pointer",
  transition: "background-color 0.2s ease",
  marginTop: spacing.sm, // Add margin top for spacing

  "&:disabled": {
    backgroundColor: themeColors.background.elevation3,
    cursor: "not-allowed",
    color: themeColors.text.disabled,
  },

  variants: {
    variant: {
      primary: {
        backgroundColor: themeColors.primary[500],
        color: "white",
        "&:hover": { backgroundColor: themeColors.primary[600] },
      },
      success: {
        backgroundColor: themeColors.success[500], // Use success color from theme
        color: "white",
        "&:hover": { backgroundColor: themeColors.success[600] },
      },
      uploading: {
        backgroundColor: themeColors.background.elevation3, // Example uploading style
        color: themeColors.text.secondary,
        cursor: "default",
      },
      failed: {
        backgroundColor: "var(--red-9)", // Use Radix red color variable
        color: "white",
        "&:hover": { backgroundColor: "var(--red-10)" }, // Use Radix red color variable
      },
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

// Grid container for layout
const FormGrid = styled("div", {
  display: "grid",
  gap: spacing.lg, // Use large gap for grid layout
  "@media (min-width: 768px)": {
    // Apply two-column layout only on larger screens
    gridTemplateColumns: "1fr 2fr", // Adjust column ratios as needed (e.g., 1fr 2fr)
  },
  "@media (max-width: 767px)": {
    gridTemplateColumns: "1fr", // Single column on mobile
  },
});

// Add styled component for error messages
const ErrorMessage = styled("span", {
  color: "red",
  fontSize: "0.8rem",
  marginTop: "4px",
  display: "block",
});

// Add validation interface
interface ValidationErrors {
  excercise_name?: string;
  excercise_description?: string;
  excercise_reps?: string;
  excercise_sets?: string;
  excercise_muscles_involved?: string;
  excercise_related_conditions?: string;
}

// Add type for form fields that need validation
type ValidatableFields = 'excercise_name' | 'excercise_description' | 'excercise_reps' | 'excercise_sets' | 'excercise_muscles_involved' | 'excercise_related_conditions';

// --- Component Logic --- //
export const AddExcercise = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [excercise, setExcercise] = useState<iExcerciseData>({
    excercise_name: "",
    excercise_description: "",
    excercise_reps: 0,
    excercise_reps_description: "",
    excercise_sets: 0,
    excercise_sets_description: "",
    excercise_image_url: "",
    excercise_video_url: "",
    excercise_duration: "",
    excercise_muscles_involved: "",
    excercise_related_conditions: "",
    excercise_category: "",
    excercise_type: "",
    excercise_tags: "",
    excercise_level: "",
    excercise_equipment: "",
    excercise_target: "",
    excercise_benefits: "",
    excercise_precautions: "",
    excercise_variations: "",
    excercise_mistakes: "",
    excercise_tips: "",
    excercise_created_by: "",
  });

  const doctorData = useSelector(
    (state: UserSessionStateType) => state.userSession.user
  );
  const { isExcerciseBuilderRefresh, setIsExcerciseBuilderRefresh } =
    useCurrentMainScreenContext();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // State for upload button text and visual state
  type UploadState = "idle" | "uploading" | "success" | "failed";
  const [uploadState, setUploadState] = useState<UploadState>("idle");

  const { showToast } = useToast();
  const navigate = useNavigate();
  const { pid } = useParams();

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // --- Handlers ---

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const image = event.target.files[0];
      setSelectedImage(image);
      setPreview(URL.createObjectURL(image));
      setImageUrl(null); // Reset image URL if new image is selected
      setUploadState("idle"); // Reset upload state
    }
  };

  const validateField = (name: ValidatableFields, value: string | number | string[]) => {
    let error = "";
    
    switch (name) {
      case "excercise_name":
        if (!value) error = "Exercise name is required";
        else if (typeof value === "string" && value.length < 2) error = "Name must be at least 2 characters";
        else if (typeof value === "string" && value.length > 200) error = "Name must be at most 200 characters";
        break;
      case "excercise_description":
        if (!value) error = "Description is required";
        else if (typeof value === "string" && value.length < 30) error = "Description must be at least 30 characters";
        else if (typeof value === "string" && value.length > 1000) error = "Description must be at most 1000 characters";
        break;
      case "excercise_reps":
        if (!value) error = "Number of repetitions is required";
        else if (Number(value) <= 0) error = "Repetitions must be greater than 0";
        else if (Number(value) > 1000) error = "Repetitions must be less than 1000";
        break;
      case "excercise_sets":
        if (!value) error = "Number of sets is required";
        else if (Number(value) <= 0) error = "Sets must be greater than 0";
        else if (Number(value) > 100) error = "Sets must be less than 100";
        break;
      case "excercise_muscles_involved":
        if (!value || (Array.isArray(value) && value.length === 0)) error = "At least one muscle must be specified";
        break;
      case "excercise_related_conditions":
        if (!value || (Array.isArray(value) && value.length === 0)) error = "At least one condition must be specified";
        break;
    }
    
    return error;
  };

  const handleOnChange = useCallback(
    (
      value: string | number | string[],
      field: keyof iExcerciseData
    ) => {
      // Handle tag inputs specifically
      if (
        field === "excercise_muscles_involved" ||
        field === "excercise_related_conditions" ||
        field === "excercise_tags"
      ) {
        setExcercise((prev) => ({
          ...prev,
          [field]: Array.isArray(value) ? value.join(",") : "",
        }));
        // Validate tag fields
        if (field === "excercise_muscles_involved" || field === "excercise_related_conditions") {
          const error = validateField(field as ValidatableFields, value);
          setValidationErrors(prev => ({
            ...prev,
            [field]: error
          }));
        }
      } else if (
        typeof value === "string" &&
        (field === "excercise_reps" || field === "excercise_sets")
      ) {
        setExcercise((prev) => ({
          ...prev,
          [field]: parseInt(value, 10) || 0,
        }));
        // Validate number fields
        if (field === "excercise_reps" || field === "excercise_sets") {
          const error = validateField(field as ValidatableFields, parseInt(value, 10) || 0);
          setValidationErrors(prev => ({
            ...prev,
            [field]: error
          }));
        }
      } else {
        setExcercise((prev) => ({
          ...prev,
          [field]: value,
        }));
        // Validate other fields
        if (field === "excercise_name" || field === "excercise_description") {
          const error = validateField(field as ValidatableFields, value);
          setValidationErrors(prev => ({
            ...prev,
            [field]: error
          }));
        }
      }
    },
    []
  );

  // Specific handler for NumberComponent (adapts its output for handleOnChange)
  const handleNumberChange = useCallback(
    (
      e: { target: { value: number } },
      index: number | undefined,
      property_name: keyof iExcerciseData | undefined
    ) => {
      if (property_name) {
        const value = e.target.value;
        // Validate number fields immediately
        if (property_name === "excercise_reps" || property_name === "excercise_sets") {
          const error = validateField(property_name as ValidatableFields, value);
          setValidationErrors(prev => ({
            ...prev,
            [property_name]: error
          }));
        }
        handleOnChange(value, property_name);
      }
    },
    [handleOnChange] // Depends on handleOnChange
  );

  // Specific handler for TagInput (adapts its output for handleOnChange)
  const handleTagChange = useCallback(
    (tags: string[], field: keyof iExcerciseData) => {
      handleOnChange(tags, field);
    },
    [handleOnChange] // Depends on handleOnChange
  );

  const handleUpload = () => {
    if (!selectedImage) {
      showToast("Please select an image first.", 3000, ToastColors.YELLOW);
      return;
    }
    setUploadState("uploading");
    // Use doctor ID and timestamp for potentially unique paths
    const uniquePath = `images/${doctorData.uid}/${Date.now()}_${
      selectedImage.name
    }`;
    const storageRef = ref(storage, uniquePath);
    const uploadTask = uploadBytes(storageRef, selectedImage);

    uploadTask
      .then((snapshot) => {
        console.log("Image uploaded successfully!");
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          setImageUrl(downloadURL);
          setUploadState("success");
          console.log("File available at", downloadURL);
        });
      })
      .catch((error) => {
        setUploadState("failed");
        showToast(
          "Image upload failed. Please try again.",
          5000,
          ToastColors.RED
        );
        console.error("Error uploading image:", error);
      });
  };

  const onCreateBtnClick = () => {
    if (!imageUrl) {
      showToast("Please upload an image first.", 4000, ToastColors.YELLOW);
      return;
    }

    // Validate all fields before submission
    const errors: ValidationErrors = {};
    const validatableFields: ValidatableFields[] = [
      'excercise_name',
      'excercise_description',
      'excercise_reps',
      'excercise_sets',
      'excercise_muscles_involved',
      'excercise_related_conditions'
    ];
    
    validatableFields.forEach(field => {
      let value: string | number | string[] = excercise[field];
      if (field === 'excercise_muscles_involved' || field === 'excercise_related_conditions') {
        value = typeof excercise[field] === 'string' 
          ? excercise[field].split(',').filter(Boolean)
          : [];
      }
      const error = validateField(field, value);
      if (error) errors[field] = error;
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      showToast("Please correct the errors in the form", 4000, ToastColors.RED);
      return;
    }

    // Add doctor ID before creating
    const finalExcerciseData = {
      ...excercise,
      excercise_image_url: imageUrl,
      excercise_created_by: doctorData.uid,
    };
    handleCreateExcercise(finalExcerciseData);
  };

  const handleCreateExcercise = async (newExcercise: iExcerciseData) => {
    // Basic Validation (expand as needed)
    if (!newExcercise.excercise_name.trim()) {
      showToast("Exercise Name is required.", 4000, ToastColors.YELLOW);
      return;
    }
    if (newExcercise.excercise_sets <= 0 || newExcercise.excercise_reps <= 0) {
      showToast(
        "Sets and Reps must be greater than zero.",
        4000,
        ToastColors.YELLOW
      );
      return;
    }

    // Show loading state on submit button? (Could add another state)

    try {
      const apiData = {
        doctorId: doctorData.uid, // Already included in newExcercise now
        excercise: newExcercise,
      };
      createExcercise({
        data: apiData,
        afterAPIFail: (res) => {
          showToast(
            res.message || "Failed to create exercise.",
            5000,
            ToastColors.RED
          );
          console.log(res);
        },
        afterAPISuccess(res) {
          showToast("Exercise created successfully!", 5000, ToastColors.GREEN);
          setIsExcerciseBuilderRefresh(!isExcerciseBuilderRefresh);
          // Optionally navigate back or clear the form
          if (pid) {
            // Navigate back to buildPlan for the specific patient
            navigate(`/doctorhome/main/patientDetails/${pid}/buildPlan`);
          } else {
            // Or navigate to a general exercise list or clear form if no patient context
            // navigate('/doctorhome/main/excerciseList'); // Example
            // Reset form state here if needed
          }
          console.log(res);
        },
      });
    } catch (error) {
      console.error("Error adding exercise:", error);
      showToast("An unexpected error occurred.", 5000, ToastColors.RED);
    }
  };

  // Determine upload button text and variant based on state
  const getUploadButtonProps = () => {
    switch (uploadState) {
      case "uploading":
        return { text: "Uploading...", variant: "uploading", disabled: true };
      case "success":
        return {
          text: "Uploaded Successfully",
          variant: "success",
          disabled: true,
        };
      case "failed":
        return {
          text: "Upload Failed - Retry?",
          variant: "failed",
          disabled: false,
        };
      case "idle":
      default:
        return {
          text: "Upload Image",
          variant: "primary",
          disabled: !selectedImage,
        };
    }
  };
  const uploadButtonProps = getUploadButtonProps();

  // --- JSX ---
  return (
    // Use the Modal component as the main wrapper
    <Modal
      onActionButtonClick={onCreateBtnClick}
      actionButtonText="Create Exercise"
      title="Add New Exercise" // Updated title
    >
      <ScrollArea style={{ maxHeight: "65vh" }}>
        {/* Use FormGrid for the overall layout */}
        <FormGrid>
          {/* Column 1: Image Upload */}
          <Flex direction="column" gap="3">
            {" "}
            {/* Use theme spacing */}
            <Heading size="5" style={{ color: themeColors.text.primary }}>
              {" "}
              {/* Use theme colors */}
              Exercise Image
            </Heading>
            <StyledFormField>
              <FieldLabel htmlFor="file-upload">Select Image File</FieldLabel>
              <FileInput
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </StyledFormField>
            {preview && (
              <div
                style={{
                  border: `1px solid ${themeColors.background.elevation3}`,
                  borderRadius: theme.radius[2],
                  overflow: "hidden",
                  maxHeight: "300px", // Limit preview height
                  marginBottom: spacing.sm,
                }}
              >
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: "100%",
                    display: "block",
                    objectFit: "contain",
                  }}
                />
              </div>
            )}
            <StyledButton
              variant={
                uploadButtonProps.variant as
                  | "primary"
                  | "success"
                  | "uploading"
                  | "failed"
              }
              size="2" // Smaller button size?
              onClick={handleUpload}
              disabled={uploadButtonProps.disabled}
              style={{ width: "auto", alignSelf: "flex-start" }} // Adjust button width/alignment
            >
              {uploadButtonProps.text}
            </StyledButton>
          </Flex>

          {/* Column 2: Details Form */}
          <Flex direction="column" gap="3">
            <Heading size="5" style={{ color: themeColors.text.primary }}>
              Exercise Details
            </Heading>

            {/* Exercise Name */}
            <StyledFormField>
              <FieldLabel htmlFor="excercise_name">Exercise Name</FieldLabel>
              <Input
                id="excercise_name"
                placeholder="e.g., Bicep Curl"
                value={excercise.excercise_name}
                onChange={(e) =>
                  handleOnChange(e.target.value, "excercise_name")
                }
                required
              />
              {validationErrors.excercise_name && (
                <ErrorMessage>{validationErrors.excercise_name}</ErrorMessage>
              )}
            </StyledFormField>

            {/* Description */}
            <StyledFormField>
              <FieldLabel htmlFor="excercise_description">
                Description / Instructions
              </FieldLabel>
              <TextArea
                id="excercise_description"
                placeholder="Provide detailed steps...\n1. Stand tall...\n2. Curl the weight..."
                value={excercise.excercise_description}
                onChange={(e) =>
                  handleOnChange(e.target.value, "excercise_description")
                }
                rows={6} // Adjust rows as needed
              />
              {validationErrors.excercise_description && (
                <ErrorMessage>{validationErrors.excercise_description}</ErrorMessage>
              )}
            </StyledFormField>

            {/* Grid for Sets/Reps & Descriptions */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: spacing.md,
              }}
            >
              {/* Sets & Set Description */}
              <Flex direction="column" gap="2">
                <StyledFormField>
                  <FieldLabel>Number of Sets</FieldLabel>
                  <NumberComponent
                    initialValue={excercise.excercise_sets}
                    handleInputChange={handleNumberChange}
                    property_name="excercise_sets"
                  />
                  {validationErrors.excercise_sets && (
                    <ErrorMessage>{validationErrors.excercise_sets}</ErrorMessage>
                  )}
                </StyledFormField>
                <StyledFormField>
                  <FieldLabel htmlFor="excercise_sets_description">
                    Set Description (Optional)
                  </FieldLabel>
                  <Input
                    id="excercise_sets_description"
                    placeholder="e.g., Rest 60s between sets"
                    value={excercise.excercise_sets_description}
                    onChange={(e) =>
                      handleOnChange(
                        e.target.value,
                        "excercise_sets_description"
                      )
                    }
                  />
                </StyledFormField>
              </Flex>

              {/* Reps & Rep Description */}
              <Flex direction="column" gap="2">
                <StyledFormField>
                  <FieldLabel>Number of Repetitions</FieldLabel>
                  <NumberComponent
                    initialValue={excercise.excercise_reps}
                    handleInputChange={handleNumberChange}
                    property_name="excercise_reps"
                  />
                  {validationErrors.excercise_reps && (
                    <ErrorMessage>{validationErrors.excercise_reps}</ErrorMessage>
                  )}
                </StyledFormField>
                <StyledFormField>
                  <FieldLabel htmlFor="excercise_reps_description">
                    Repetition Description (Optional)
                  </FieldLabel>
                  <Input
                    id="excercise_reps_description"
                    placeholder="e.g., Perform slowly"
                    value={excercise.excercise_reps_description}
                    onChange={(e) =>
                      handleOnChange(
                        e.target.value,
                        "excercise_reps_description"
                      )
                    }
                  />
                </StyledFormField>
              </Flex>
            </div>

            {/* Muscles Involved */}
            <StyledFormField>
              <FieldLabel htmlFor="muscles_involved">
                Muscles Involved
              </FieldLabel>
              <TagInput
                id="muscles_involved"
                placeholder="Add muscles (e.g., Biceps, Deltoids)"
                // Convert comma-separated string back to array for initial value
                initialTags={
                  excercise.excercise_muscles_involved
                    ? excercise.excercise_muscles_involved
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean)
                    : []
                }
                onChange={(tags) =>
                  handleTagChange(tags, "excercise_muscles_involved")
                }
              />
              {validationErrors.excercise_muscles_involved && (
                <ErrorMessage>{validationErrors.excercise_muscles_involved}</ErrorMessage>
              )}
            </StyledFormField>

            {/* Related Conditions */}
            <StyledFormField>
              <FieldLabel htmlFor="related_conditions">
                Related Conditions
              </FieldLabel>
              <TagInput
                id="related_conditions"
                placeholder="Add conditions (e.g., Shoulder Impingement)"
                initialTags={
                  excercise.excercise_related_conditions
                    ? excercise.excercise_related_conditions
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean)
                    : []
                }
                onChange={(tags) =>
                  handleTagChange(tags, "excercise_related_conditions")
                }
              />
              {validationErrors.excercise_related_conditions && (
                <ErrorMessage>{validationErrors.excercise_related_conditions}</ErrorMessage>
              )}
            </StyledFormField>

            {/* Add more fields as needed using StyledFormField, FieldLabel, Input/TextArea/TagInput */}
            {/* Example: */}
            {/*
          <StyledFormField>
              <FieldLabel htmlFor="excercise_level">Difficulty Level</FieldLabel>
              <Input id="excercise_level" placeholder="e.g., Beginner, Intermediate" value={excercise.excercise_level} onChange={(e) => handleOnChange(e.target.value, "excercise_level")} />
          </StyledFormField>
          */}
          </Flex>
        </FormGrid>
      </ScrollArea>
    </Modal>
  );
};
