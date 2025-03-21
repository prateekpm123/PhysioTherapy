import React, { useRef, useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { H4, H6 } from "./TextTags";
import { iExcerciseData } from "../models/ExcerciseInterface";
import DatabaseController from "../databaseConnections/DatabaseController";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../databaseConnections/FireBaseConnection";
// import { storage } from "../databaseConnections/FireBaseStorageInstance";
import { isMobile } from "react-device-detect";


interface iAddExcercise {
  refreshExcercise: () => void;
}

export const AddExcercise = ({ refreshExcercise }: iAddExcercise) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const setNumber = useRef<HTMLInputElement>(null);
  const setDescription = useRef<HTMLInputElement>(null);
  const repetitionNumber = useRef<HTMLInputElement>(null);
  const repetitionDescription = useRef<HTMLTextAreaElement>(null);
  const excerciseDescription = useRef<HTMLTextAreaElement>(null);
  const excerciseName = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadBtnText, setUploadBtnText] = useState<string>("Upload");
  const [uploadBtnColor, setUploadBtnColor] = useState<string>("bg-slate-800");

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const image = event.target.files[0];
      setSelectedImage(image);
      setPreview(URL.createObjectURL(image));
    }
  };

  const onAddExcerciseBtnClick = () => {
    const newExcercise: iExcerciseData = {
      name: excerciseName.current?.value.toString() || "",
      imgSrc: imageUrl || "",
      description: {
        sets: Number(setNumber.current?.value) || 0,
        setsDescription: setDescription.current?.value || "",
        repititions: Number(repetitionNumber.current?.value) || 0,
        repititionsDescription: repetitionDescription.current?.value || "",
        Cues: {
          Points: excerciseDescription.current?.value?.split("\n") || [""],
        },
      },
      type: "",
      tags: [],
    };

    handleAddExercise(newExcercise);
  };

  const handleAddExercise = async (newExcercise: iExcerciseData) => {
    try {
      const dbController = DatabaseController.getInstance();
      const result = dbController.addNewExercise(newExcercise);
      result
        .then((result) => {
          if (result) {
            console.log("Triggered refresh Successfully");
            refreshExcercise();
          }
        })
        .catch((error) => {
          console.error("Error adding exercise:", error);
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

  return (
    <div
      className={
        isMobile ? "grid grid-cols-1 gap-4" : "grid grid-cols-12 gap-8"
      }
    >
      <div className={isMobile ? "col-span-1 h-1/2" : "col-span-4 h-1/2"}>
        <h1 className="text-6xl text-slate-100 mb-4">Upload Image</h1>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="bg-slate-800 p-2 rounded-md w-full m-1 justify-end text-slate-100"
        />

        {preview && (
          <div>
            <img
              src={preview}
              alt="Preview"
              className="w-full"
              // style={{ maxWidth: "200px" }}
            />
          </div>
        )}
        <button
          className={
            uploadBtnColor +
            " p-2 rounded-md w-full m-1 justify-end text-slate-100"
          }
          onClick={handleUpload}
          disabled={!selectedImage}
        >
          {uploadBtnText}
        </button>
      </div>
      <div className={isMobile ? "col-span-1 h-fit" : "col-span-8 h-fit"}>
        <H4 className="text-slate-100">Details</H4>
        <div
          className={
            isMobile
              ? "grid grid-cols-1 gap-4 mt-3"
              : "grid grid-cols-2 gap-8 mt-4"
          }
        >
          <div className="col-span-1 h-fit">
            <H6 className="text-slate-100 mb-4">No of Sets</H6>
            <input
              className="w-full p-2 mb-4 bg-slate-800 text-slate-100"
              ref={setNumber}
              type="number"
              data-testid="setNumberInput"
            ></input>
            <H6 className="text-slate-100">Set Description</H6>
            <input
              className="w-full p-2 mb-6 bg-slate-800 text-slate-100"
              ref={setDescription}
              data-testid="setDescriptionInput"
            ></input>
            <H6 className="text-slate-100">Repetition</H6>
            <input
              className="w-full p-2 mb-6 bg-slate-800 text-slate-100"
              ref={repetitionNumber}
              type="number"
              data-testid="repititionNumberInput"
            ></input>
            <H6 className="text-slate-100">Description</H6>
            <textarea
              className="w-full p-2 h-32 bg-slate-800 text-slate-100"
              ref={repetitionDescription}
              data-testid="repititionDescriptionInput"
            ></textarea>
          </div>
          <div className="col-span-1 h-fit">
            <H6 className="text-slate-100 mb-4">Excercise Name</H6>
            <input
              className="w-full p-2 mb-4 bg-slate-800 text-slate-100"
              ref={excerciseName}
              data-testid="excerciseNameInput"
              ></input>
            <H6 className="text-slate-100 mb-4">Description</H6>
            <textarea
              className="w-full p-2 h-96 bg-slate-800 text-slate-100"
              ref={excerciseDescription}
              placeholder={"1. \n2. \n3. \n4."}
              data-testid="excerciseDescriptionInput"
              ></textarea>
          </div>
        </div>
      </div>

      <div className={isMobile ? "col-span-1 " : "col-span-12 "}>
        <button
          onClick={onAddExcerciseBtnClick}
          className="bg-slate-800 p-4 text-3xl rounded-md w-full m-1 justify-end text-slate-100"
        >
          Add Excercise
        </button>
      </div>
    </div>
  );
};
