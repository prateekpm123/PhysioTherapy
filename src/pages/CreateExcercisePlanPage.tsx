import React from "react";
import { Flex, Heading, TextField, Button } from "@radix-ui/themes";
import { iExcerciseDataDto } from "../models/ExcerciseInterface";
import { saveExcercisePlan } from "../controllers/ExcerciseController";
import { useCurrentMainScreenContext } from "./DoctorHomePage/DoctorHomePage";

// interface CreateExcercisePlanPageProps {
//   exercises: iExcerciseDataDto[];
// }

const CreateExcercisePlanPage = () => {
  const {
    currentPatientDetails,
    excerciseBuilderPlannerList,
    setExcerciseBuilderPlannerList,
  } = useCurrentMainScreenContext();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    field: keyof iExcerciseDataDto
  ) => {
    const updatedExercises = [...excerciseBuilderPlannerList];
    if (field === "excercise_reps" || field === "excercise_sets") {
      updatedExercises[index][field] = parseInt(e.target.value, 10);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updatedExercises[index][field] = e.target.value as any;
    }
    setExcerciseBuilderPlannerList(updatedExercises);
  };

  const onExcercisePlanSave = () => {
    const data = {
      excercises: excerciseBuilderPlannerList,
      patientData: currentPatientDetails,
    };
    saveExcercisePlan({
      data: data,
      afterAPISuccess: (response) => {
        console.log(response);
      },
      afterAPIFail: (response) => {
        console.log(response);
      },
    });
  };

  return (
    <Flex direction="column" gap="4">
      <Flex direction="row" gap="4">
        {excerciseBuilderPlannerList.map((exercise, index) => (
          <Flex direction="column" gap="2" mb="4" key={exercise.e_id}>
            <Heading size="4">{exercise.excercise_name}</Heading>
            <TextField.Root
              value={exercise.excercise_name}
              onChange={(e) => handleInputChange(e, index, "excercise_name")}
              placeholder="Exercise Name"
            ></TextField.Root>
            <TextField.Root
              value={exercise.excercise_description}
              onChange={(e) =>
                handleInputChange(e, index, "excercise_description")
              }
              placeholder="Description"
            ></TextField.Root>
            <TextField.Root
              value={exercise.excercise_video_url || ""}
              onChange={(e) =>
                handleInputChange(e, index, "excercise_video_url")
              }
              placeholder="Video URL"
            />
            <TextField.Root
              value={exercise.excercise_image_url}
              onChange={(e) =>
                handleInputChange(e, index, "excercise_image_url")
              }
              placeholder="Image URL"
            ></TextField.Root>
            <TextField.Root
              value={exercise.excercise_duration || ""}
              onChange={(e) =>
                handleInputChange(e, index, "excercise_duration")
              }
              placeholder="Duration"
            ></TextField.Root>
            <TextField.Root
              type="number"
              value={exercise.excercise_reps}
              onChange={(e) => handleInputChange(e, index, "excercise_reps")}
              placeholder="Reps"
            ></TextField.Root>
            <TextField.Root
              value={exercise.excercise_reps_description}
              onChange={(e) =>
                handleInputChange(e, index, "excercise_reps_description")
              }
              placeholder="Reps Description"
            ></TextField.Root>
            <TextField.Root
              type="number"
              value={exercise.excercise_sets}
              onChange={(e) => handleInputChange(e, index, "excercise_sets")}
              placeholder="Sets"
            ></TextField.Root>
            <TextField.Root
              value={exercise.excercise_sets_description}
              onChange={(e) =>
                handleInputChange(e, index, "excercise_sets_description")
              }
              placeholder="Sets Description"
            ></TextField.Root>
            {/* Add TextField.Roots for other fields similarly */}
          </Flex>
        ))}
      </Flex>
      <Button onClick={() => onExcercisePlanSave()}>Create Plan</Button>
    </Flex>
  );
};

export default CreateExcercisePlanPage;
