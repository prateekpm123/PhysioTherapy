// import { collection, addDoc } from 'firebase/firestore'; // Import Firestore functions
// import { database } from './FireBaseConnection'; // Import your Firestore instance
// import { iExcerciseData } from '../models/ExcerciseInterface';

// const addExercisesToFirestore = async (exercisesData: iExcerciseData[]) => {
//   try {
//     const exercisesCollectionRef = collection(database, 'exercises'); // Reference to the 'exercises' collection
//     await addDoc(exercisesCollectionRef, exercisesData); // Add the JSON data as a document
//     console.log('Exercises added to Firestore!');
//   } catch (error) {
//     console.error('Error adding exercises to Firestore:', error);
//   }

import { ref, set } from "firebase/database";
import data from "../../database/excerciseDatabase.json";
import { database } from "./FireBaseConnection"; // Import your Realtime Database instance

const testFirebase = () => {
  const exercisesRef = ref(database, "exercises");

  set(exercisesRef, data)
    .then(() => {
      console.log("Exercises node created with initial data!");
    })
    .catch((error) => {
      console.error("Error creating exercises node:", error);
    });
};

export default testFirebase;
