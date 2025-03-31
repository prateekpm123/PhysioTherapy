
import { ref } from "firebase/storage";
import { uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../databaseConnections/FireBaseConnection";

 
 
 export const uploadImageToFirebase = (selectedImageFile: File) => {
    if (!selectedImageFile) {
      alert("Please select an image first.");
      return;
    }
    const storageRef = ref(storage, "images/" + selectedImageFile.name); // Customize the path/filename
    const uploadTask = uploadBytes(storageRef, selectedImageFile);
    // setUploadBtnText("Uploading...");
    // setUploadBtnColor("bg-slate-800");
    uploadTask
      .then((snapshot) => {
        // setUploadBtnText("Uploaded");
        // setUploadBtnColor("bg-green-800");
        console.log("Image uploaded successfully!");
        // Optionally, get the download URL for the uploaded image
        getDownloadURL(snapshot.ref).then((downloadURL) => {
        //   setImageUrl(downloadURL);
          // setUploadBtnText("Upload Success");
          console.log("File available at", downloadURL);
          // Store this download URL in Firestore or Realtime Database if needed
        });
      })
      .catch((error) => {
        // setUploadBtnText("Upload Failed");
        console.error("Error uploading image:", error);
      });
  };