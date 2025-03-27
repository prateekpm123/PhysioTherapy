import React, { useRef, useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { H4, H6 } from "../../../../components/TextTags";
import { iExcerciseDataDto } from "../../../../models/ExcerciseInterface";
// import DatabaseController from "../databaseConnections/DatabaseController";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../databaseConnections/FireBaseConnection";
// import { storage } from "../databaseConnections/FireBaseStorageInstance";
import { isMobile } from "react-device-detect";
import { Flex, Heading, Text, Button, Dialog } from "@radix-ui/themes";
import { updateExcercise } from "../../../../controllers/ExcerciseController";

interface iEditExcercise {
  excercise: iExcerciseDataDto | undefined;
  e_id: string | undefined;
}

export const EditExcercise = (props: iEditExcercise) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    props.excercise?.excercise_image_url || null
  );
  const [noOfSets, setNoOfSets] = useState<number>(
    props.excercise?.excercise_sets || 0
  );
  const [setDescriptionState, setSetDescription] = useState<string>(
    props.excercise?.excercise_sets_description || ""
  );
  const [repetitionNumberState, setRepetitionNumberState] = useState<number>(
    props.excercise?.excercise_reps || 0
  );
  const [repetitionDescriptionState, setRepetitionDescriptionState] =
    useState<string>(props.excercise?.excercise_reps_description || "");
  const [excerciseNameState, setExcerciseNameState] = useState<string>(
    props.excercise?.excercise_name || ""
  );
  const [excerciseDescriptionState, setExcerciseDescriptionState] = useState<
    string[]
  >((props.excercise?.excercise_description || "").split("\n"));

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
        imageUrl || props.excercise?.excercise_image_url || "",
      excercise_sets: Number(setNumber.current?.value) || 0,
      excercise_sets_description: setDescription.current?.value || "",
      excercise_reps: Number(repetitionNumber.current?.value) || 0,
      excercise_reps_description: repetitionDescription.current?.value || "",
      excercise_description: excerciseDescription.current?.value || "",
      excercise_type: props.excercise?.excercise_type || "",
      excercise_tags: props.excercise?.excercise_tags || "",
      excercise_video_url: props.excercise?.excercise_video_url || "",
      excercise_duration: props.excercise?.excercise_duration || "",
      excercise_category: props.excercise?.excercise_category || "",
      excercise_level: props.excercise?.excercise_level || "",
      excercise_equipment: props.excercise?.excercise_equipment || "",
      excercise_target: props.excercise?.excercise_target || "",
      excercise_benefits: props.excercise?.excercise_benefits || "",
      excercise_precautions: props.excercise?.excercise_precautions || "",
      excercise_variations: props.excercise?.excercise_variations || "",
      excercise_mistakes: props.excercise?.excercise_mistakes || "",
      excercise_tips: props.excercise?.excercise_tips || "",
      excercise_created_by: props.excercise?.excercise_created_by || "",
      e_id: props.excercise?.e_id || "",
      excercise_created_on: props.excercise?.excercise_created_on || new Date(),
      modified_created_on: new Date(),
    };

    handleEditExercise(newExcercise);
  };

  const handleEditExercise = async (newExcercise: iExcerciseDataDto) => {
    try {
      updateExcercise({
        data:newExcercise,
        afterAPIFail: (res)=> {
          console.log(res);
        },
        afterAPISuccess(res) {
          console.log(res);
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
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="soft" size="3">
          Edit
        </Button>
      </Dialog.Trigger>

      <Dialog.Content minWidth="80rem" width="100%">
        <Dialog.Title>{props.excercise?.excercise_name}</Dialog.Title>
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
            <Heading size="8" color="gray">
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
            <Heading size="8" color="gray">
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
              <Flex
                direction="column"
                gap="4"
                style={{ height: "fit-content" }}
              >
                <Text size="3" color="gray">
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
                <Text size="3" color="gray">
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
                  onChange={(e) =>
                    handleInputChangeString(e, setSetDescription)
                  }
                />
                <Text size="3" color="gray">
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
                <Text size="3" color="gray">
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
              <Flex
                direction="column"
                gap="4"
                style={{ height: "fit-content" }}
              >
                <Text size="3" color="gray">
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
                <Text size="3" color="gray">
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
        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button onClick={onEditExcerciseBtnClick}>Edit Excercise</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

