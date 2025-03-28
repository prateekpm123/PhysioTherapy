/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { iExcerciseData } from "../../../../models/ExcerciseInterface";
// import DatabaseController from "../databaseConnections/DatabaseController";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../databaseConnections/FireBaseConnection";
// import { storage } from "../databaseConnections/FireBaseStorageInstance";
import { isMobile } from "react-device-detect";
import { Flex, Heading, Text, Button } from "@radix-ui/themes";
import { createExcercise } from "../../../../controllers/ExcerciseController";
// import { IoMdAdd } from "react-icons/io";
import { useSelector } from "react-redux";
import { UserSessionStateType } from "../../../../stores/userSessionStore";
import { useCurrentMainScreenContext } from "../../DoctorHomePage";
// import ThemeColorPallate from "../../../../assets/ThemeColorPallate";
import Modal from "./TestModal";
import ThemeColorPallate from "../../../../assets/ThemeColorPallate";
import { useToast } from "../../../../stores/ToastContext";
import { ToastColors } from "../../../../components/Toast";
import { useNavigate } from "react-router-dom";

export const AddExcercise = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  // const [excercise, setExcercise] = useState<iExcerciseData>(
  //   {} as iExcerciseData
  // );

  const excercise = {} as iExcerciseData;
  const doctorData = useSelector(
    (state: UserSessionStateType) => state.userSession.user
  );
  const { isExcerciseBuilderRefresh, setIsExcerciseBuilderRefresh } =
    useCurrentMainScreenContext();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [creeateExcerciseBtnText, setCreateExcerciseBtnText] =
    useState<string>("Create Excercise");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadBtnText, setUploadBtnText] = useState<string>("Upload");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [uploadBtnColor, setUploadBtnColor] = useState<string>("bg-slate-800");

  const {showToast} = useToast();
  const navigate = useNavigate();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const image = event.target.files[0];
      setSelectedImage(image);
      setPreview(URL.createObjectURL(image));
    }
  };

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof iExcerciseData
  ) => {
    e.stopPropagation();
    if (field === "excercise_reps" || field === "excercise_sets") {
      excercise[field] = parseInt(e.target.value, 10);
      // setExcercise({ ...excercise, [field]: parseInt(e.target.value, 10) });
    } else {
      excercise[field] = e.target.value as any;
      // setExcercise({ ...excercise, [field]: e.target.value as any });
    }
  };

  const onCreateBtnClick = () => {
    setCreateExcerciseBtnText("Creating...");
    if (imageUrl) {
      excercise.excercise_image_url = imageUrl;
      // setExcercise({ ...excercise, ["excercise_image_url"]: imageUrl });
      handleCreateExcercise(excercise);
    }
  };

  const handleCreateExcercise = async (newExcercise: iExcerciseData) => {
    try {
      const apiData = {
        doctorId: doctorData.uid,
        excercise: newExcercise,
      };
      createExcercise({
        data: apiData,
        afterAPIFail: (res) => {
          showToast("Failed to create excercise", 5000, ToastColors.RED);
          console.log(res);
        },
        afterAPISuccess(res) {
          navigate(-1);
          // setReset(reset + 1);
          showToast("Excercise created successfully", 5000, ToastColors.GREEN);
          setIsExcerciseBuilderRefresh(!isExcerciseBuilderRefresh);
          setCreateExcerciseBtnText("Created");
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
          setUploadBtnText("Got the URL");
          console.log("File available at", downloadURL);
          // Store this download URL in Firestore or Realtime Database if needed
        });
      })
      .catch((error) => {
        setUploadBtnText("Upload Failed");
        console.error("Error uploading image:", error);
      });
  };

  return (
    <Modal onActionButtonClick={onCreateBtnClick} actionButtonText="Create Excercise" title="Add Excercise">
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
        <Heading size="8" style={{color: ThemeColorPallate.cardFontColorBlack}}>
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
        <Heading size="8" style={{color: ThemeColorPallate.cardFontColorBlack}}>
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
            <Text size="3" style={{color: ThemeColorPallate.cardFontColorBlack}}>
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
              type="number"
              data-testid="setNumberInput"
              onChange={(e) => handleOnChange(e, "excercise_sets")}
            />
            <Text size="3" style={{color: ThemeColorPallate.cardFontColorBlack}}>
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
              data-testid="setDescriptionInput"
              onChange={(e) => handleOnChange(e, "excercise_sets_description")}
              // onChange={(e) =>
              //   handleInputChangeString(e, setSetDescription)
              // }
            />
            <Text size="3" style={{color: ThemeColorPallate.cardFontColorBlack}}>
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
              type="number"
              data-testid="repititionNumberInput"
              onChange={(e) => handleOnChange(e, "excercise_reps")}
              // onChange={(e) =>
              //   handleInputChangeNumber(e, setRepetitionNumberState)
              // }
            />
            <Text size="3" style={{color: ThemeColorPallate.cardFontColorBlack}}>
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
              onChange={(e) => handleOnChange(e, "excercise_reps_description")}
              data-testid="repititionDescriptionInput"
              // onChange={(e) =>
              //   handleInputChangeString(e, setRepetitionDescriptionState)
              // }
            />
          </Flex>
          <Flex direction="column" gap="4" style={{ height: "fit-content" }}>
            <Text size="3" style={{color: ThemeColorPallate.cardFontColorBlack}}>
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
              onChange={(e) => handleOnChange(e, "excercise_name")}
              data-testid="excerciseNameInput"
              // onChange={(e) =>
              //   handleInputChangeString(e, setExcerciseNameState)
              // }
            />
            <Text size="3" style={{color: ThemeColorPallate.cardFontColorBlack}}>
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
              // ref={excerciseDescription}
              placeholder={"1. \n2. \n3. \n4."}
              data-testid="excerciseDescriptionInput"
              onChange={(e) => handleOnChange(e, "excercise_description")}
              // value={excerciseDescriptionState.join("\n")}
              // onChange={(e) =>
              //   handleInputChangeArray(e, setExcerciseDescriptionState)
              // }
            />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
    </Modal>
  );
};
