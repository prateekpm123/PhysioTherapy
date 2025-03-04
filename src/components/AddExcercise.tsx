import React, { useRef, useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { H1, H4, H6, H7 } from "./TextTags";
import { iExcerciseData } from "../models/ExcerciseInterface";
import excerciseData from "../../database/excerciseDatabase.json";
import DatabaseController from "../databaseConnections/DatabaseController";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../databaseConnections/FireBaseConnection";

// import { storage } from "../databaseConnections/FireBaseStorageInstance";

export const AddExcercise = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const setNumber = useRef<HTMLInputElement>(null);
  const setDescription = useRef<HTMLInputElement>(null);
  const repetitionNumber = useRef<HTMLInputElement>(null);
  const repetitionDescription = useRef<HTMLTextAreaElement>(null);
  const excerciseDescription = useRef<HTMLTextAreaElement>(null);
  const excerciseName = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

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
      dbController.addNewExercise(newExcercise);
      return;

      const existingData = excerciseData;

      // Add the new exercise (adjust based on your JSON structure)
      existingData.push(newExcercise);

      const updatedJson = JSON.stringify(existingData, null, 2);

      // Create a downloadable JSON file
      const blob = new Blob([updatedJson], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "exercises.json";
      a.click();
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
    const storageRef = ref(storage, "images/my-image.jpg"); // Customize the path/filename
    const uploadTask = uploadBytes(storageRef, selectedImage);

    uploadTask
      .then((snapshot) => {
        console.log("Image uploaded successfully!");
        // Optionally, get the download URL for the uploaded image
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          setImageUrl(downloadURL);
          console.log("File available at", downloadURL);
          // Store this download URL in Firestore or Realtime Database if needed
        });
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });

    // const reader = new FileReader();

    // reader.onloadend = () => {
    //   if (typeof reader.result === "string") {
    //     localStorage.setItem("uploadedImage", reader.result);
    //     alert("Image stored locally!");
    //     // Optionally, reset the image and preview
    //     setSelectedImage(null);
    //     setPreview(null);
    //   }
    // };

    // reader.readAsDataURL(selectedImage);
  };

  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-4 h-1/2">
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
          className="bg-slate-800 p-2 rounded-md w-full m-1 justify-end text-slate-100"
          onClick={handleUpload}
          disabled={!selectedImage}
        >
          Upload
        </button>
      </div>
      <div className="col-span-8 h-fit">
        <H4 className="text-slate-100">Details</H4>
        <div className="grid grid-cols-2 gap-8 mt-4">
          <div className="col-span-1 h-fit">
            <H6 className="text-slate-100 mb-4">No of Sets</H6>
            <input
              className="w-full p-2 mb-4 bg-slate-800 text-slate-100"
              ref={setNumber}
              type="number"
            ></input>
            <H6 className="text-slate-100">Set Description</H6>
            <input
              className="w-full p-2 mb-6 bg-slate-800 text-slate-100"
              ref={setDescription}
            ></input>
            <H6 className="text-slate-100">Repetition</H6>
            <input
              className="w-full p-2 mb-6 bg-slate-800 text-slate-100"
              ref={repetitionNumber}
              type="number"
            ></input>
            <H6 className="text-slate-100">Description</H6>
            <textarea
              className="w-full p-2 h-32 bg-slate-800 text-slate-100"
              ref={repetitionDescription}
            ></textarea>
          </div>
          <div className="col-span-1 h-fit">
            <H6 className="text-slate-100 mb-4">Excercise Name</H6>
            <input
              className="w-full p-2 mb-4 bg-slate-800 text-slate-100"
              ref={excerciseName}
            ></input>
            <H6 className="text-slate-100 mb-4">Description</H6>
            <textarea
              className="w-full p-2 h-96 bg-slate-800 text-slate-100"
              ref={excerciseDescription}
              placeholder={"1. \n2. \n3. \n4."}
            ></textarea>
          </div>
        </div>
      </div>

      <div className="col-span-12 ">
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
