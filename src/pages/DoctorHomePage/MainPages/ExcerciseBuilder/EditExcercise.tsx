/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback, useEffect } from "react";
import { iExcerciseDataDto } from "../../../../models/ExcerciseInterface";
import { updateExcercise } from "../../../../controllers/ExcerciseController";
import { useToast } from "../../../../stores/ToastContext";
import { ToastColors } from "../../../../components/Toast";
import { Flex, Heading, Text, Button, ScrollArea } from "@radix-ui/themes";
import { useNavigate, useLocation } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../databaseConnections/FireBaseConnection";
import { isMobile } from "react-device-detect";
import Modal from "./TestModal";

// Import Theme and Shared Components (adjust paths as needed)
import { themeColors, spacing, theme } from "../../../../theme/theme";
import { styled } from "@stitches/react";
import TagInput from "../../../../components/TagInputs";
import NumberComponent from "../../../../components/NumberComonent";
import { useSelector } from "react-redux";
import { UserSessionStateType } from "../../../../stores/userSessionStore";

// --- Styled Components (Copied from AddExcercise - consider moving to shared file) --- //
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
  marginBottom: spacing.sm,
};

const StyledFormField = styled("div", {
  marginBottom: spacing.md,
});

const FieldLabel = styled(Text, {
  display: "block",
  color: themeColors.text.secondary,
  marginBottom: spacing.xs,
  fontSize: "0.9rem",
  fontWeight: "500",
});

const Input = styled("input", BaseInputStyles);
const TextArea = styled("textarea", {
  ...BaseInputStyles,
  resize: "vertical",
  minHeight: "80px",
});

const FileInput = styled("input", {
  ...BaseInputStyles,
  padding: spacing.xs,
  backgroundColor: themeColors.background.elevation1,
  border: `1px solid ${themeColors.background.elevation3}`,
  color: themeColors.text.primary,
  cursor: 'pointer',
  '::file-selector-button': { 
      padding: `${spacing.xs} ${spacing.sm}`,
      marginRight: spacing.sm,
      backgroundColor: themeColors.primary[500],
      color: 'white',
      border: 'none',
      borderRadius: theme.radius[1],
      cursor: 'pointer',
      '&:hover': {
          backgroundColor: themeColors.primary[600],
      }
  }
});

const StyledButton = styled(Button, {
    width: "100%",
    padding: spacing.sm,
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    marginTop: spacing.sm,
    '&:disabled': {
        backgroundColor: themeColors.background.elevation3,
        cursor: "not-allowed",
        color: themeColors.text.disabled,
    },
    variants: {
        variant: {
            primary: {
                backgroundColor: themeColors.primary[500],
                color: 'white',
                '&:hover': { backgroundColor: themeColors.primary[600] },
            },
            success: {
                backgroundColor: themeColors.success[500],
                color: 'white',
                '&:hover': { backgroundColor: themeColors.success[600] },
            },
            uploading: {
                backgroundColor: themeColors.background.elevation3,
                color: themeColors.text.secondary,
                cursor: 'default',
            },
            failed: {
                backgroundColor: 'var(--red-9)',
                 color: 'white',
                '&:hover': { backgroundColor: 'var(--red-10)' },
            }
        }
    },
    defaultVariants: {
        variant: 'primary'
    }
});

const FormGrid = styled("div", {
  display: "grid",
  gap: spacing.lg,
  '@media (min-width: 768px)': { 
    gridTemplateColumns: "1fr 2fr", 
  },
  '@media (max-width: 767px)': {
    gridTemplateColumns: "1fr",
  }
});

// --- Component Logic --- //
export const EditExcercise = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const doctorData = useSelector( 
    (state: UserSessionStateType) => state.userSession.user
  );

  // Initial exercise data from location state
  const initialExcercise = location.state?.excercise as iExcerciseDataDto | undefined;

  const [excercise, setExcercise] = useState<iExcerciseDataDto | null>(initialExcercise || null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initialExcercise?.excercise_image_url || null);
  const [imageUrl, setImageUrl] = useState<string | null>(initialExcercise?.excercise_image_url || null); // Keep track if URL is from upload or initial

  type UploadState = 'idle' | 'uploading' | 'success' | 'failed';
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  
  // Redirect or show error if initial data is missing
  useEffect(() => {
      if (!initialExcercise) {
          showToast("Exercise data not found for editing.", 5000, ToastColors.RED);
          navigate(-1); // Go back if data is missing
      }
  }, [initialExcercise, navigate, showToast]);


  // --- Handlers (Adapted from AddExcercise) --- //

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const image = event.target.files[0];
      setSelectedImage(image);
      setPreview(URL.createObjectURL(image));
      setImageUrl(null); // Reset image URL - new upload needed
      setUploadState('idle'); 
    }
  };

  const handleOnChange = useCallback(
    (
      value: string | number | string[],
      field: keyof iExcerciseDataDto // Use DTO type here
    ) => {
        if (!excercise) return; // Should not happen due to useEffect check

        let processedValue: any = value;
        if (field === "excercise_muscles_involved" || field === "excercise_related_conditions" || field === "excercise_tags") {
            processedValue = Array.isArray(value) ? value.join(',') : '';
        } else if (typeof value === 'string' && (field === "excercise_reps" || field === "excercise_sets")) {
             processedValue = parseInt(value, 10) || 0;
        }
        
        setExcercise(prev => prev ? { ...prev, [field]: processedValue } : null);
    },
    [excercise] // Depend on excercise state
  );

  const handleNumberChange = useCallback(
    (e: { target: { value: number } }, index: number | undefined, property_name: keyof iExcerciseDataDto | undefined) => {
        if (property_name) {
            handleOnChange(e.target.value, property_name);
        }
    },
    [handleOnChange]
  );

  const handleTagChange = useCallback(
    (tags: string[], field: keyof iExcerciseDataDto) => {
      handleOnChange(tags, field);
    },
    [handleOnChange]
  );

 const handleUpload = () => {
    if (!selectedImage) {
      showToast("Please select a new image file first.", 3000, ToastColors.YELLOW);
      return;
    }
    setUploadState('uploading');
    // Ensure doctorData is available (might need a check or default)
    const uid = doctorData?.uid || 'unknown_doctor'; 
    const uniquePath = `images/${uid}/${Date.now()}_${selectedImage.name}`;
    const storageRef = ref(storage, uniquePath);
    const uploadTask = uploadBytes(storageRef, selectedImage);

    uploadTask
      .then((snapshot) => {
        console.log("Image uploaded successfully!");
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          setImageUrl(downloadURL); // Store the newly uploaded URL
          // Update the image URL in the main state as well
          setExcercise(prev => prev ? { ...prev, excercise_image_url: downloadURL } : null);
          setUploadState('success');
          console.log("File available at", downloadURL);
        });
      })
      .catch((error) => {
        setUploadState('failed');
        showToast("Image upload failed. Please try again.", 5000, ToastColors.RED);
        console.error("Error uploading image:", error);
      });
  };

  const onEditExcerciseBtnClick = () => {
      if (!excercise) {
          showToast("Cannot save, exercise data is missing.", 4000, ToastColors.RED);
          return;
      }
       // Check if a new image was selected but not uploaded successfully
      if (selectedImage && uploadState !== 'success' && !initialExcercise?.excercise_image_url) {
           showToast("Please upload the selected image or remove it.", 4000, ToastColors.YELLOW);
           return;
       }

      // Basic Validation
      if (!excercise.excercise_name.trim()) {
          showToast("Exercise Name is required.", 4000, ToastColors.YELLOW);
          return;
      }
      if (excercise.excercise_sets <= 0 || excercise.excercise_reps <= 0) {
          showToast("Sets and Reps must be greater than zero.", 4000, ToastColors.YELLOW);
          return;
      }

      // Ensure the image URL is the latest uploaded one if applicable
      const finalExcerciseData = {
          ...excercise,
          excercise_image_url: imageUrl || excercise.excercise_image_url, // Prioritize newly uploaded URL
          modified_created_on: new Date(), // Update modified date
      };

      handleEditExercise(finalExcerciseData);
  };

  const handleEditExercise = async (exerciseToUpdate: iExcerciseDataDto) => {
    // Add loading state indicator if needed
    try {
      updateExcercise({
        data: exerciseToUpdate,
        afterAPIFail: (res) => {
          showToast(res.message || "Failed to update exercise.", 5000, ToastColors.RED);
          console.log(res);
          // Consider staying on the modal on failure
        },
        afterAPISuccess(res) {
          showToast("Exercise updated successfully!", 5000, ToastColors.GREEN);
          console.log(res);
          navigate(-1); // Go back on success
        },
      });
    } catch (error) {
      console.error("Error updating exercise:", error);
      showToast("An unexpected error occurred during update.", 5000, ToastColors.RED);
    }
  };

  // Upload button state logic (same as AddExcercise)
  const getUploadButtonProps = () => {
      switch (uploadState) {
          case 'uploading': return { text: 'Uploading...', variant: 'uploading', disabled: true };
          case 'success': return { text: 'Uploaded Successfully', variant: 'success', disabled: true };
          case 'failed': return { text: 'Upload Failed - Retry?', variant: 'failed', disabled: false };
          case 'idle':
          default: return { text: 'Upload New Image', variant: 'primary', disabled: !selectedImage };
      }
  };
  const uploadButtonProps = getUploadButtonProps();
  
  // Render loading or null if data not ready
   if (!excercise) {
      // Or a proper loading skeleton
      return <Modal title="Loading..." onActionButtonClick={() => {}} actionButtonText=""><Text>Loading exercise data...</Text></Modal>; 
   }

  // --- JSX --- //
  return (
    <Modal onActionButtonClick={onEditExcerciseBtnClick} actionButtonText="Save Changes" title="Edit Exercise">
      <ScrollArea style={{ maxHeight: "65vh" }}>
      <FormGrid>
        {/* Column 1: Image Upload */}
        <Flex direction="column" gap="3">
          <Heading size="5" style={{ color: themeColors.text.primary }}>
            Exercise Image
          </Heading>
          <StyledFormField>
            <FieldLabel htmlFor="file-upload">Select New Image File (Optional)</FieldLabel>
            <FileInput
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </StyledFormField>
          {preview && (
            <div style={{
              border: `1px solid ${themeColors.background.elevation3}`,
              borderRadius: theme.radius[2],
              overflow: 'hidden',
              maxHeight: '300px',
              marginBottom: spacing.sm
            }}>
              <img
                src={preview} // Shows initial image or new preview
                alt="Exercise Preview"
                style={{ width: "100%", display: 'block', objectFit: 'contain' }}
              />
            </div>
          )}
          {/* Show upload button only if a new image is selected */}
          {selectedImage && (
              <StyledButton
                variant={uploadButtonProps.variant as 'primary' | 'success' | 'uploading' | 'failed'}
                size="2"
                onClick={handleUpload}
                disabled={uploadButtonProps.disabled}
                style={{ width: 'auto', alignSelf: 'flex-start' }}
              >
                {uploadButtonProps.text}
              </StyledButton>
           )}
        </Flex>

        {/* Column 2: Details Form */}
        <Flex direction="column" gap="3">
          <Heading size="5" style={{ color: themeColors.text.primary }}>
            Exercise Details
          </Heading>
          <StyledFormField>
            <FieldLabel htmlFor="excercise_name">Exercise Name</FieldLabel>
            <Input
              id="excercise_name"
              value={excercise.excercise_name}
              onChange={(e) => handleOnChange(e.target.value, "excercise_name")}
              required
            />
          </StyledFormField>
          <StyledFormField>
            <FieldLabel htmlFor="excercise_description">Description / Instructions</FieldLabel>
            <TextArea
              id="excercise_description"
              value={excercise.excercise_description}
              onChange={(e) => handleOnChange(e.target.value, "excercise_description")}
              rows={6}
            />
          </StyledFormField>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: spacing.md }}>
            <Flex direction="column" gap="2">
              <StyledFormField>
                <FieldLabel>Number of Sets</FieldLabel>
                <NumberComponent
                  initialValue={excercise.excercise_sets} // Use initialValue from state
                  handleInputChange={handleNumberChange}
                  property_name="excercise_sets"
                />
              </StyledFormField>
              <StyledFormField>
                <FieldLabel htmlFor="excercise_sets_description">Set Description (Optional)</FieldLabel>
                <Input
                  id="excercise_sets_description"
                  value={excercise.excercise_sets_description}
                  onChange={(e) => handleOnChange(e.target.value, "excercise_sets_description")}
                />
              </StyledFormField>
            </Flex>
            <Flex direction="column" gap="2">
              <StyledFormField>
                <FieldLabel>Number of Repetitions</FieldLabel>
                <NumberComponent
                  initialValue={excercise.excercise_reps} // Use initialValue from state
                  handleInputChange={handleNumberChange}
                  property_name="excercise_reps"
                />
              </StyledFormField>
              <StyledFormField>
                <FieldLabel htmlFor="excercise_reps_description">Repetition Description (Optional)</FieldLabel>
                <Input
                  id="excercise_reps_description"
                  value={excercise.excercise_reps_description}
                  onChange={(e) => handleOnChange(e.target.value, "excercise_reps_description")}
                />
              </StyledFormField>
            </Flex>
          </div>
          <StyledFormField>
            <FieldLabel htmlFor="muscles_involved">Muscles Involved</FieldLabel>
            <TagInput
              id="muscles_involved"
              initialTags={excercise.excercise_muscles_involved ? excercise.excercise_muscles_involved.split(',').map(t => t.trim()).filter(Boolean) : []}
              onChange={(tags) => handleTagChange(tags, "excercise_muscles_involved")}
            />
          </StyledFormField>
          <StyledFormField>
            <FieldLabel htmlFor="related_conditions">Related Conditions</FieldLabel>
            <TagInput
              id="related_conditions"
              initialTags={excercise.excercise_related_conditions ? excercise.excercise_related_conditions.split(',').map(t => t.trim()).filter(Boolean) : []}
              onChange={(tags) => handleTagChange(tags, "excercise_related_conditions")}
            />
          </StyledFormField>
          {/* Add inputs for other iExcerciseDataDto fields if needed */}
        </Flex>
      </FormGrid>
      </ScrollArea>
    </Modal>
  );
};
