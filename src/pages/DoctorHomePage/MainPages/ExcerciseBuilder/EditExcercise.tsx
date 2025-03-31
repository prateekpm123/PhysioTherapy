import React, { useRef, useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { H4, H6 } from "../../../../components/TextTags";
import { iExcerciseDataDto } from "../../../../models/ExcerciseInterface";
// import DatabaseController from "../databaseConnections/DatabaseController";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../databaseConnections/FireBaseConnection";
// import { storage } from "../databaseConnections/FireBaseStorageInstance";
import { isMobile } from "react-device-detect";
import { Flex, Heading, Text, Button } from "@radix-ui/themes";
import { updateExcercise } from "../../../../controllers/ExcerciseController";
import Modal from "./TestModal";
import { useLocation, useNavigate } from "react-router-dom";
import ThemeColorPallate from "../../../../assets/ThemeColorPallate";
import { useToast } from "../../../../stores/ToastContext";
import { ToastColors } from "../../../../components/Toast";
import { uploadImageToFirebase } from "../../../../controllers/ImageController";

// interface iEditExcercise {
//   excercise: iExcerciseDataDto | undefined;
//   e_id: string | undefined;
// }

export const EditExcercise = () => {
  const location = useLocation();
  const excercise = location.state.excercise as iExcerciseDataDto;
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    excercise?.excercise_image_url || null
  );
  const [noOfSets, setNoOfSets] = useState<number>(
    excercise?.excercise_sets || 0
  );
  const [setDescriptionState, setSetDescription] = useState<string>(
    excercise?.excercise_sets_description || ""
  );
  const [repetitionNumberState, setRepetitionNumberState] = useState<number>(
    excercise?.excercise_reps || 0
  );
  const [repetitionDescriptionState, setRepetitionDescriptionState] =
    useState<string>(excercise?.excercise_reps_description || "");
  const [excerciseNameState, setExcerciseNameState] = useState<string>(
    excercise?.excercise_name || ""
  );
  const [excerciseDescriptionState, setExcerciseDescriptionState] = useState<
    string[]
  >((excercise?.excercise_description || "").split("\n"));

  const {showToast} = useToast();
  const navigate = useNavigate();
  const setNumber = useRef<HTMLInputElement>(null);
  const setDescription = useRef<HTMLInputElement>(null);
  const repetitionNumber = useRef<HTMLInputElement>(null);
  const repetitionDescription = useRef<HTMLTextAreaElement>(null);
  const excerciseDescription = useRef<HTMLTextAreaElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [editExcerciseBtnText, setEditExcerciseBtnText] =
    useState<string>("Edit Excercise");
  const excerciseName = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadBtnText, setUploadBtnText] = useState<string>("Upload");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [uploadBtnColor, setUploadBtnColor] = useState<string>("bg-slate-800");

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const image = event.target.files[0];
      setSelectedImage(image);
      setPreview(URL.createObjectURL(image));
    }
  };

  const onEditExcerciseBtnClick = () => {
    setEditExcerciseBtnText("Editing...");
    const newExcercise: iExcerciseDataDto = {
      excercise_name: excerciseName.current?.value.toString() || "",
      excercise_image_url:
        imageUrl || excercise?.excercise_image_url || "",
      excercise_sets: Number(setNumber.current?.value) || 0,
      excercise_sets_description: setDescription.current?.value || "",
      excercise_reps: Number(repetitionNumber.current?.value) || 0,
      excercise_reps_description: repetitionDescription.current?.value || "",
      excercise_description: excerciseDescription.current?.value || "",
      excercise_type: excercise?.excercise_type || "",
      excercise_tags: excercise?.excercise_tags || "",
      excercise_video_url: excercise?.excercise_video_url || "",
      excercise_duration: excercise?.excercise_duration || "",
      excercise_category: excercise?.excercise_category || "",
      excercise_level: excercise?.excercise_level || "",
      excercise_equipment: excercise?.excercise_equipment || "",
      excercise_target: excercise?.excercise_target || "",
      excercise_benefits: excercise?.excercise_benefits || "",
      excercise_precautions: excercise?.excercise_precautions || "",
      excercise_variations: excercise?.excercise_variations || "",
      excercise_mistakes: excercise?.excercise_mistakes || "",
      excercise_tips: excercise?.excercise_tips || "",
      excercise_created_by: excercise?.excercise_created_by || "",
      e_id: excercise?.e_id || "",
      excercise_created_on: excercise?.excercise_created_on || new Date(),
      modified_created_on: new Date(),
    };

    handleEditExercise(newExcercise);
  };

  const handleEditExercise = async (newExcercise: iExcerciseDataDto) => {
    try {
      updateExcercise({
        data: newExcercise,
        afterAPIFail: (res) => {
          showToast("Failed to update excercise", 5000, ToastColors.RED);
          console.log(res);
          navigate(-1);
        },
        afterAPISuccess(res) {
          showToast("Excercise saved successfully", 5000, ToastColors.GREEN);
          console.log(res);
          navigate(-1);
        },
      });
    } catch (error) {
      console.error("Error adding exercise:", error);
      // Handle the error, e.g., display an error message to the user
    }
  };

  const handleUpload = () => {
    if (!selectedImage) {
      alert("Please select an image first.");
      return;
    }
    const storageRef = ref(storage, "images/" + selectedImage.name); // Customize the path/filename
    const uploadTask = uploadBytes(storageRef, selectedImage);
    setUploadBtnText("Uploading...");
    setUploadBtnColor("bg-slate-800");
    uploadTask
      .then((snapshot) => {
        setUploadBtnText("Uploaded");
        setUploadBtnColor("bg-green-800");
        console.log("Image uploaded successfully!");
        // Optionally, get the download URL for the uploaded image
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          setImageUrl(downloadURL);
          // setUploadBtnText("Upload Success");
          console.log("File available at", downloadURL);
          // Store this download URL in Firestore or Realtime Database if needed
        });
      })
      .catch((error) => {
        setUploadBtnText("Upload Failed");
        console.error("Error uploading image:", error);
      });
  };

  const handleInputChangeNumber = (
    e: React.ChangeEvent<HTMLInputElement>,
    setINputFn: React.Dispatch<React.SetStateAction<number>>
  ) => {
    setINputFn(Number(e.target.value));
  };

  const handleInputChangeString = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setInputFn: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setInputFn(e.target.value);
  };

  const handleInputChangeArray = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    setInputFn: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setInputFn(e.target.value.split("\n"));
  };

  return (
    // <Dialog.Root>
    //   <Dialog.Trigger>
    //     <Button variant="soft" size="3">
    //       Edit
    //     </Button>
    //   </Dialog.Trigger>

    //   <Dialog.Content minWidth="80rem" width="100%">
    //     <Dialog.Title>{excercise?.excercise_name}</Dialog.Title>
    <Modal onActionButtonClick={onEditExcerciseBtnClick} title="Edit Excercise">
      <Flex
        direction="column"
        gap="4"
        p="4"
        width="100%"
        style={{
          gridTemplateColumns: isMobile ? "1fr" : "4fr 8fr",
          display: "grid",
        }}
      >
        <Flex direction="column" gap="4" style={{ height: "fit-content" }}>
          <Heading size="8" style={{ color: ThemeColorPallate.cardFontColorBlack }}>
            Upload Image
          </Heading>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{
              backgroundColor: "rgb(30, 41, 59)",
              padding: "8px",
              borderRadius: "6px",
              width: "100%",
              margin: "4px 0",
              color: "rgb(241, 245, 249)",
            }}
          />

          {preview && (
            <div>
              <img src={preview} alt="Preview" style={{ width: "100%" }} />
            </div>
          )}
          <Button
            variant="soft"
            size="3"
            onClick={handleUpload}
            disabled={!selectedImage}
          >
            {uploadBtnText}
          </Button>
        </Flex>
        <Flex direction="column" gap="4" style={{ height: "fit-content" }}>
          <Heading size="8" style={{ color: ThemeColorPallate.cardFontColorBlack }}>
            Details
          </Heading>
          <Flex
            style={{
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              display: "grid",
              gap: "16px",
              marginTop: "8px",
            }}
          >
            <Flex direction="column" gap="4" style={{ height: "fit-content" }}>
              <Text size="3" style={{ color: ThemeColorPallate.cardFontColorBlack }}>
                No of Sets
              </Text>
              <input
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "16px",
                  backgroundColor: "rgb(30, 41, 59)",
                  color: "rgb(241, 245, 249)",
                }}
                ref={setNumber}
                type="number"
                data-testid="setNumberInput"
                value={noOfSets}
                onChange={(e) => handleInputChangeNumber(e, setNoOfSets)}
              />
              <Text size="3" style={{ color: ThemeColorPallate.cardFontColorBlack }}>
                Set Description
              </Text>
              <input
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "24px",
                  backgroundColor: "rgb(30, 41, 59)",
                  color: "rgb(241, 245, 249)",
                }}
                ref={setDescription}
                value={setDescriptionState}
                data-testid="setDescriptionInput"
                onChange={(e) => handleInputChangeString(e, setSetDescription)}
              />
              <Text size="3" style={{ color: ThemeColorPallate.cardFontColorBlack }}>
                Repetition
              </Text>
              <input
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "24px",
                  backgroundColor: "rgb(30, 41, 59)",
                  color: "rgb(241, 245, 249)",
                }}
                ref={repetitionNumber}
                type="number"
                value={repetitionNumberState}
                data-testid="repititionNumberInput"
                onChange={(e) =>
                  handleInputChangeNumber(e, setRepetitionNumberState)
                }
              />
              <Text size="3" style={{ color: ThemeColorPallate.cardFontColorBlack }}>
                Description
              </Text>
              <textarea
                style={{
                  width: "100%",
                  padding: "8px",
                  height: "128px",
                  backgroundColor: "rgb(30, 41, 59)",
                  color: "rgb(241, 245, 249)",
                }}
                ref={repetitionDescription}
                value={repetitionDescriptionState}
                data-testid="repititionDescriptionInput"
                onChange={(e) =>
                  handleInputChangeString(e, setRepetitionDescriptionState)
                }
              />
            </Flex>
            <Flex direction="column" gap="4" style={{ height: "fit-content" }}>
              <Text size="3" style={{ color: ThemeColorPallate.cardFontColorBlack }}>
                Excercise Name
              </Text>
              <input
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "16px",
                  backgroundColor: "rgb(30, 41, 59)",
                  color: "rgb(241, 245, 249)",
                }}
                ref={excerciseName}
                value={excerciseNameState}
                data-testid="excerciseNameInput"
                onChange={(e) =>
                  handleInputChangeString(e, setExcerciseNameState)
                }
              />
              <Text size="3" style={{ color: ThemeColorPallate.cardFontColorBlack }}>
                Description
              </Text>
              <textarea
                style={{
                  width: "100%",
                  padding: "8px",
                  height: "384px",
                  backgroundColor: "rgb(30, 41, 59)",
                  color: "rgb(241, 245, 249)",
                }}
                ref={excerciseDescription}
                placeholder={"1. \n2. \n3. \n4."}
                data-testid="excerciseDescriptionInput"
                value={excerciseDescriptionState.join("\n")}
                onChange={(e) =>
                  handleInputChangeArray(e, setExcerciseDescriptionState)
                }
              />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Modal>
    //     <Flex gap="3" mt="4" justify="end">
    //       <Dialog.Close>
    //         <Button variant="soft" color="gray">
    //           Cancel
    //         </Button>
    //       </Dialog.Close>
    //       <Dialog.Close>
    //         <Button onClick={onEditExcerciseBtnClick}>Edit Excercise</Button>
    //       </Dialog.Close>
    //     </Flex>
    //   </Dialog.Content>
    // </Dialog.Root>
  );
};
