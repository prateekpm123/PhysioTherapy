import React, { useState } from "react";
import { Flex, Heading, TextField, Button, Skeleton } from "@radix-ui/themes";
import { iExcerciseDataDto } from "../../../models/ExcerciseInterface";
import { saveExcercisePlan } from "../../../controllers/ExcerciseController";
import {
  DoctorHomeMainScreen,
  useCurrentMainScreenContext,
} from "../DoctorHomePage";
// import ErrorHandler from "../../../errorHandlers/ErrorHandler";
import { DefaultToastTiming, useToast } from "../../../stores/ToastContext";
import { ToastColors } from "../../../components/Toast";
import { useNavigate, useParams } from "react-router-dom";

// interface CreateExcercisePlanPageProps {
//   exercises: iExcerciseDataDto[];
// }

const CreateExcercisePlanPage = () => {
  const {
    currentPatientDetails,
    excerciseBuilderPlannerList,
    setCurrentMainScreen,
    setExcerciseBuilderPlannerList,
    breadCrumbItems,
    setBreadCrumbItems,
  } = useCurrentMainScreenContext();

  const { showToast } = useToast();
  const navigate = useNavigate();
  const { pid} = useParams();
  const [isLoading, setIsLoading] = useState(false);
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
      patientId: pid,
    };
    setIsLoading(true);
    saveExcercisePlan({
      data: data,
      afterAPISuccess: (response) => {
    setIsLoading(false);
        showToast(
          "Excercise Plan created successfully",
          DefaultToastTiming,
          ToastColors.GREEN
        );
        breadCrumbItems.pop();
        breadCrumbItems.pop();
        setBreadCrumbItems(breadCrumbItems);
        setExcerciseBuilderPlannerList([])
        navigate("/doctorhome/main/patientDetails/" + currentPatientDetails?.p_id);
        setCurrentMainScreen(DoctorHomeMainScreen.PATIENT_DETAILS);
        console.log(response);
      },
      afterAPIFail: (response) => {
        setIsLoading(false);
        showToast(response.message, DefaultToastTiming, ToastColors.RED);
        // ErrorHandler(response);
        // console.log(response);
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
      <Skeleton loading={isLoading}>
      <Button onClick={() => onExcercisePlanSave()}>Create Plan</Button>
      </Skeleton>
    </Flex>
  );
};

export default CreateExcercisePlanPage;
