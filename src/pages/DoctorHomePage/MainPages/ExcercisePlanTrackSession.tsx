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

import React, { useState, useMemo, useEffect } from "react";
// import { iExcercisePlanDto, iExcerciseDataDto } from './your-interfaces'; // Adjust the import path
import {
  Button,
  Flex,
  ScrollArea,
  Skeleton,
  Text,
  TextArea,
} from "@radix-ui/themes"; // Assuming you're using radix-ui/themes
import {
  iExcerciseCompletionDto,
  iExcerciseDataDto,
  iExcercisePlanNote,
} from "../../../models/ExcerciseInterface";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  getExcerciseTrackingSessionData,
  saveExcerciseCompletionData,
  saveExcercisePlanNotes,
} from "../../../controllers/ExcerciseController";
import { useCurrentMainScreenContext } from "../DoctorHomePage";
import { DefaultToastTiming, useToast } from "../../../stores/ToastContext";
import { ToastColors } from "../../../components/Toast";
// import { useExcercisePlanDetails } from "./ExcercisePlanDetailsPage";
// import { iExcerciseTrackingOnSubmitProps } from './ExcercisePlanDetailsPage';

const ExcercisePlanTrackSession: React.FC = () => {
  const [exerciseCompletions, setExerciseCompletions] = useState<
    iExcerciseCompletionDto[]
  >([]);
  const { isExcercisePlanTrackingSessionRefresh, setBreadCrumbItems } =
    useCurrentMainScreenContext();
  //   const { onExcercisePlanTodaysTrackingSubmit } = useExcercisePlanDetails();
  const [noteText, setNoteText] = useState("");
  const [note, setNote] = useState<iExcercisePlanNote>();
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { sessionDate, excercisePlan } = location.state;
  const { epid, pid } = useParams();
  const navigate = useNavigate();
  const today = useMemo(() => new Date(sessionDate), []);
  const { showToast } = useToast();
  
  // Set breadcrumbs when component is loaded
  useEffect(() => {
    setBreadCrumbItems([
      {
        label: "Patient Details",
        onClick: () => {
          navigate("/doctorhome/main/patientDetails/" + pid);
        },
      },
      {
        label: "Exercise Plan",
        onClick: () => {
          navigate("/doctorhome/main/patientDetails/" + pid + "/excercisePlans/" + epid);
        },
      },
      {
        label: "Track Session",
      },
    ]);
  }, [pid, epid, navigate, setBreadCrumbItems]);
  
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
            // ec_id: `${exerciseId}-${today.toISOString()}`, // Generate a unique ID
            excerciseId: exerciseId,
            completed,
            excercisePlanId: excercisePlan.ep_id, // Assuming `excercisePlan.id` exists
            // excercisePlan: excercisePlan, // Assuming `excercisePlan` is the full object
            // excercises: [], // Provide a default or relevant value
            // excercise_completion: [],
            date: today.toISOString(), // Use today's date
          },
        ];
      }
    });
  };

  useEffect(() => {
    setIsLoading(true);
    getExcerciseTrackingSessionData({
      data: {
        epn_id: note?.epn_id,
        ep_id: epid,
        date: sessionDate,
      },
      afterAPISuccess: (res) => {
        setIsLoading(false);
        setExerciseCompletions(res.excercisePlans.excercisePlanCompleted);
        setNote(res.excercisePlans.excercisePlanNotes[0]);
        setNoteText(res.excercisePlans.excercisePlanNotes[0]?.notes || "");
      },
      afterAPIFail: (res) => {
        setIsLoading(false);
        console.log(res);
      },
    });
  }, [isExcercisePlanTrackingSessionRefresh]);

  const handleSubmit = () => {
    // if (onExcercisePlanTodaysTrackingSubmit)
    //   onExcercisePlanTodaysTrackingSubmit({
    saveExcerciseCompletionData({
      data: exerciseCompletions,
      afterAPISuccess: (res) => {
        showToast("Tracking data saved", DefaultToastTiming, ToastColors.GREEN)
        console.log(noteText, res);
      },
      afterAPIFail: (res) => {
        showToast("Failed to save tracking data", DefaultToastTiming, ToastColors.RED)
        console.log(res);
      },
    });
    saveExcercisePlanNotes({
      data: {
        epn_id: note?.epn_id,
        notes: noteText,
        ep_id: epid,
        date: sessionDate,
      },
      afterAPISuccess: (res) => {
        console.log(noteText, res);
      },
      afterAPIFail: (res) => {
        console.log(res);
      },
    });
    //     excerciseCompletion: exerciseCompletions,
    //     notes,
    //   });
  };

  if (!isTodayInSession) {
    return <p>Today is not a session day.</p>;
  }

  return (
    <div>
      <Text size="5" weight="bold">
        Today's Exercises
      </Text>
      <ScrollArea style={{ height: "20vh" }}>
        {excercisePlan.excercise.map((exercise: iExcerciseDataDto) => (
          <Flex direction="row" key={exercise.e_id} align="center" gap="2">
            <Skeleton loading={isLoading}>
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
            </Skeleton>
          </Flex>
        ))}
      </ScrollArea>

      <Skeleton loading={isLoading}>
        <TextArea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Notes"
          style={{ height: "30rem", width: "100%" }}
        />
      </Skeleton>

      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
};

export default ExcercisePlanTrackSession;
