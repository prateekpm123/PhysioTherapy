// import { useLocation } from "react-router-dom";
// import { iExcercisePlanDto } from "../../../models/ExcerciseInterface";

// const ExcercisePlanTrackSession = () => {
//   const location = useLocation();
//   const excercisePlan: iExcercisePlanDto = location.state.excercisePlan || {};
//   return (
//     <div>
//       <h1>Exercise Plan Track Session</h1>
//       <p>This is the Exercise Plan Track Session page.</p>
//       {excercisePlan.selected_days}
//     </div>
//   );
// };

// export default ExcercisePlanTrackSession;

import React, { useState, useMemo } from "react";
// import { iExcercisePlanDto, iExcerciseDataDto } from './your-interfaces'; // Adjust the import path
import { Button, Flex, ScrollArea, Text, TextArea } from "@radix-ui/themes"; // Assuming you're using radix-ui/themes
import {
  iExcerciseCompletionDto,
  iExcerciseDataDto,
} from "../../../models/ExcerciseInterface";
import { useLocation } from "react-router-dom";
// import { useExcercisePlanDetails } from "./ExcercisePlanDetailsPage";
// import { iExcerciseTrackingOnSubmitProps } from './ExcercisePlanDetailsPage';

const ExcercisePlanTrackSession: React.FC = () => {
  const [exerciseCompletions, setExerciseCompletions] = useState<
    iExcerciseCompletionDto[]
  >([]);
//   const { onExcercisePlanTodaysTrackingSubmit } = useExcercisePlanDetails();
  const [notes, setNotes] = useState("");
  const location = useLocation();
  const {excercisePlan} = location.state || {};
  const today = useMemo(() => new Date(), []);

  const isTodayInSession = useMemo(() => {
    if (!excercisePlan) return false;

    const startDate = new Date(excercisePlan.startDate);
    const endDate = new Date(excercisePlan.endDate);

    if (today < startDate || today > endDate) {
      return false;
    }

    const todayDay = today.getDay() === 0 ? 7 : today.getDay(); // Adjust to 1-7 (Monday-Sunday)
    const selectedDays = excercisePlan.selected_days.split(",").map(Number);

    return selectedDays.includes(todayDay);
  }, [excercisePlan, today]);

  const handleCheckboxChange = (exerciseId: string, completed: boolean) => {
    setExerciseCompletions((prev) => {
      const existing = prev.find((item) => item.excerciseId === exerciseId);
      if (existing) {
        return prev.map((item) =>
          item.excerciseId === exerciseId ? { ...item, completed } : item
        );
      } else {
        return [
          ...prev,
          {
            ec_id: `${exerciseId}-${today.toISOString()}`, // Generate a unique ID
            excerciseId: exerciseId,
            completed,
            excercisePlanId: excercisePlan.ep_id, // Assuming `excercisePlan.id` exists
            excercisePlan: excercisePlan, // Assuming `excercisePlan` is the full object
            excercises: [], // Provide a default or relevant value
            date: today.toISOString(), // Use today's date
          },
        ];
      }
    });
  };

  const handleSubmit = () => {
    // if (onExcercisePlanTodaysTrackingSubmit)
    //   onExcercisePlanTodaysTrackingSubmit({
    //     excerciseCompletion: exerciseCompletions,
    //     notes,
    //   });
  };

  if (!isTodayInSession) {
    return <p>Today is not a session day.</p>;
  }

  return (
    <div>
      <Text size="5" weight="bold">Today's Exercises</Text>
      <ScrollArea style={{ height: "20vh" }}>
      {excercisePlan.excercise.map((exercise: iExcerciseDataDto) => (
        <Flex direction="row" key={exercise.e_id} align="center" gap="2">
          <Flex direction="column" gap="4" style={{ width: "30%" }}>
            <label>{exercise.excercise_name}</label>
          </Flex>
          <Flex direction="column" gap="4">
            <input
              type="checkbox"
              checked={
                exerciseCompletions.find(
                  (item) => item.excerciseId === exercise.e_id
                )?.completed || false
              }
              onChange={(e) =>
                handleCheckboxChange(exercise.e_id, e.target.checked)
              }
            />
          </Flex>
        </Flex>
      ))}
      </ScrollArea>

      <TextArea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes"
        style={{ height: "30rem", width: "100%" }}
      />

      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
};

export default ExcercisePlanTrackSession;
