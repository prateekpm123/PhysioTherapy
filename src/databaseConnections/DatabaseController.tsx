import { ref, get, push } from "firebase/database";
import { database } from "./FireBaseConnection";
import { iExcerciseData } from "../models/ExcerciseInterface";

class DatabaseController {
  private static dbController: DatabaseController;

  public static getInstance(): DatabaseController {
    if (!DatabaseController.dbController) {
      // throw new Error("instance not present");
      DatabaseController.dbController = new DatabaseController();
    }
    return DatabaseController.dbController;
  }
  
  fetchNodeData = async (
    nodePath: string
  ): Promise<iExcerciseData[] | null> => {
    try {
      const nodeRef = ref(database, nodePath);
      const snapshot = await get(nodeRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        return data; // Return the fetched data
      } else {
        console.log("No data found at the specified node.");
        return null; // Or handle the case where data is not found
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return null; // Or handle the error appropriately
    }
  };

  addNewExercise = async (newExercise: iExcerciseData) => {
    try {
      const exercisesRef = ref(database, "excercises");

      // Fetch existing exercises (if needed)
      const snapshot = await get(exercisesRef);
      if (snapshot.exists()) {
        // const exercises = snapshot.val();
        // exercises.push(newExercise); // Append the new exercise

        // Update the exercises node with the modified array
        const result = await push(exercisesRef, newExercise);
        // Check if the operation was successful
        if (result) {
          console.log("New exercise added successfully!");
          return true;
        } else {
          return false;
        }
      } else {
        // If the exercises node doesn't exist, create it with the new exercise
        await push(exercisesRef, [newExercise]); // Create an array with the new exercise
        console.log("Exercises node created with new exercise!");
      }
    } catch (error) {
      console.error("Error adding new exercise:", error);
    }
  };
}

export default DatabaseController;
