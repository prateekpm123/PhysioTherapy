import React, { useRef, useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { H4, H6 } from "./TextTags";
import { iExcerciseData } from "../models/ExcerciseInterface";
// import DatabaseController from "../databaseConnections/DatabaseController";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ref as databaseRef, update } from "firebase/database";
import { storage, database } from "../databaseConnections/FireBaseConnection";
// import { storage } from "../databaseConnections/FireBaseStorageInstance";

interface iEditExcercise {
  excercise: iExcerciseData | undefined;
  refreshExcercise: () => void;
  excerciseKey: string | undefined;
}

export const EditExcercise = (props: iEditExcercise) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    props.excercise?.imgSrc || null
  );
  const [noOfSets, setNoOfSets] = useState<number>(props.excercise?.description.sets || 0);
  const [setDescriptionState, setSetDescription] = useState<string>(props.excercise?.description.setsDescription || "");
  const [repetitionNumberState, setRepetitionNumberState] = useState<number>(props.excercise?.description.repititions || 0);
  const [repetitionDescriptionState, setRepetitionDescriptionState] = useState<string>(props.excercise?.description.repititionsDescription || "");
  const [excerciseNameState, setExcerciseNameState] = useState<string>(props.excercise?.name || "");
  const [excerciseDescriptionState, setExcerciseDescriptionState] = useState<string[]>(props.excercise?.description.Cues.Points || []);

  const setNumber = useRef<HTMLInputElement>(null);
  const setDescription = useRef<HTMLInputElement>(null);
  const repetitionNumber = useRef<HTMLInputElement>(null);
  const repetitionDescription = useRef<HTMLTextAreaElement>(null);
  const excerciseDescription = useRef<HTMLTextAreaElement>(null);
  const [editExcerciseBtnText, setEditExcerciseBtnText] =
    useState<string>("Edit Excercise");
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

  const onEditExcerciseBtnClick = () => {
    setEditExcerciseBtnText("Editing...");
    const newExcercise: iExcerciseData = {
      name: excerciseName.current?.value.toString() || "",
      imgSrc: imageUrl || props.excercise?.imgSrc || "",
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

    handleEditExercise(newExcercise);
  };

  const handleEditExercise = async (newExcercise: iExcerciseData) => {
    try {
      const recordRef = databaseRef(
        database,
        "excercises/" + props.excercise?.excerciseKey
      );
      update(recordRef, newExcercise)
        .then(() => {
          setEditExcerciseBtnText("Edited");
          console.log("Triggered refresh Successfully");
          props.refreshExcercise();
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

  const handleInputChangeNumber = (
    e: React.ChangeEvent<HTMLInputElement>, setINputFn: React.Dispatch<React.SetStateAction<number>>
  ) => {
    setINputFn(Number(e.target.value));
  };

  const handleInputChangeString = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, setInputFn: React.Dispatch<React.SetStateAction<string>>) => {
    setInputFn(e.target.value);
  };

  const handleInputChangeArray = (e: React.ChangeEvent<HTMLTextAreaElement>, setInputFn: React.Dispatch<React.SetStateAction<string[]>>) => {
    setInputFn(e.target.value.split("\n"));
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
      <div className="col-span-8 h-fit">
        <H4 className="text-slate-100">Details</H4>
        <div className="grid grid-cols-2 gap-8 mt-4">
          <div className="col-span-1 h-fit">
            <H6 className="text-slate-100 mb-4">No of Sets</H6>
            <input
              className="w-full p-2 mb-4 bg-slate-800 text-slate-100"
              ref={setNumber}
              type="number"
              value={noOfSets}
              onChange={(e) => handleInputChangeNumber(e, setNoOfSets)}
            ></input>
            <H6 className="text-slate-100">Set Description</H6>
            <input
              className="w-full p-2 mb-6 bg-slate-800 text-slate-100"
              ref={setDescription}
              value={setDescriptionState}
              onChange={(e) => handleInputChangeString(e, setSetDescription)}
            ></input>
            <H6 className="text-slate-100">Repetition</H6>
            <input
              className="w-full p-2 mb-6 bg-slate-800 text-slate-100"
              ref={repetitionNumber}
              type="number"
              value={repetitionNumberState}
              onChange={(e) => handleInputChangeNumber(e, setRepetitionNumberState)}
            ></input>
            <H6 className="text-slate-100">Description</H6>
            <textarea
              className="w-full p-2 h-32 bg-slate-800 text-slate-100"
              ref={repetitionDescription}
              value={repetitionDescriptionState}
              onChange={(e) => handleInputChangeString(e, setRepetitionDescriptionState)}
              ></textarea>
          </div>
          <div className="col-span-1 h-fit">
            <H6 className="text-slate-100 mb-4">Excercise Name</H6>
            <input
              className="w-full p-2 mb-4 bg-slate-800 text-slate-100"
              ref={excerciseName}
              value={excerciseNameState}
              onChange={(e) => handleInputChangeString(e, setExcerciseNameState)}
              ></input>
            <H6 className="text-slate-100 mb-4">Description</H6>
            <textarea
              className="w-full p-2 h-96 bg-slate-800 text-slate-100"
              ref={excerciseDescription}
              placeholder={"1. \n2. \n3. \n4."}
              value={excerciseDescriptionState.join("\n")}
              onChange={(e) => handleInputChangeArray(e, setExcerciseDescriptionState)}
              ></textarea>
          </div>
        </div>
      </div>

      <div className="col-span-12 ">
        <button
          onClick={onEditExcerciseBtnClick}
          className="bg-slate-800 p-4 text-3xl rounded-md w-full m-1 justify-end text-slate-100"
        >
          {editExcerciseBtnText}
        </button>
      </div>
    </div>
  );
};
