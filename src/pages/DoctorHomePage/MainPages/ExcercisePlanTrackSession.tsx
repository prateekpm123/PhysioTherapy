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
  Card,
  Heading,
  Checkbox
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
import { styled } from "@stitches/react";
import { themeColors, spacing } from "../../../theme/theme";

// --- Styled Components --- //

const TrackSessionContainer = styled(Flex, {
  flexDirection: 'column',
  padding: spacing.lg,
  gap: spacing.lg,
  backgroundColor: themeColors.background.dark,
  minHeight: 'calc(100vh - 60px)', // Adjust based on TopBar height

  "@media (max-width: 768px)": {
    padding: spacing.md,
    gap: spacing.md,
  }
});

const ExercisesCard = styled(Card, {
  padding: spacing.md,
  backgroundColor: themeColors.background.paper,
});

const ExerciseItem = styled(Flex, {
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: `${spacing.sm} 0`,
  borderBottom: `1px solid ${themeColors.background.elevation2}`,

  '&:last-child': {
    borderBottom: 'none',
  },
});

const NotesCard = styled(Card, {
  padding: spacing.md,
  backgroundColor: themeColors.background.paper,
});

const StyledTextArea = styled(TextArea, {
  minHeight: '150px',
  backgroundColor: themeColors.background.elevation1,
  color: themeColors.text.primary,
  border: `1px solid ${themeColors.background.elevation3}`,
  resize: 'vertical',

  "&:focus": {
    borderColor: themeColors.primary[500],
    boxShadow: `0 0 0 1px ${themeColors.primary[500]}`,
  }
});

const SubmitButtonContainer = styled(Flex, {
  justifyContent: 'flex-end',
  marginTop: spacing.md,
});

// --- Component Logic --- //

const ExcercisePlanTrackSession: React.FC = () => {
  const [exerciseCompletions, setExerciseCompletions] = useState<
    iExcerciseCompletionDto[]
  >([]);
  const { isExcercisePlanTrackingSessionRefresh, setBreadCrumbItems } =
    useCurrentMainScreenContext();
  const [noteText, setNoteText] = useState("");
  const [note, setNote] = useState<iExcercisePlanNote>();
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { sessionDate, excercisePlan } = location.state || {}; // Added default empty object
  const { epid, pid } = useParams();
  const navigate = useNavigate();
  const today = useMemo(() => sessionDate ? new Date(sessionDate) : new Date(), [sessionDate]); // Handle potentially undefined sessionDate
  const { showToast } = useToast();
  
  // Handle cases where state might be missing (e.g., direct navigation/refresh)
  useEffect(() => {
    if (!excercisePlan || !sessionDate) {
      showToast("Session data missing. Redirecting...", DefaultToastTiming, ToastColors.YELLOW);
      // Redirect back to the plan details or show an error message
      navigate(`/doctorhome/main/patientDetails/${pid}/excercisePlans/${epid}`);
    }
  }, [excercisePlan, sessionDate, navigate, pid, epid, showToast]);
  
  // Set breadcrumbs when component is loaded
  useEffect(() => {
    // Only set breadcrumbs if we have valid plan data
    if (excercisePlan && sessionDate) {
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
            label: `Track Session (${today.toLocaleDateString()})`,
          },
        ]);
    }
  }, [pid, epid, navigate, setBreadCrumbItems, excercisePlan, sessionDate, today]);
  
  const isTodayInSession = useMemo(() => {
    if (!excercisePlan) return false;

    const startDate = new Date(excercisePlan.startDate);
    const endDate = new Date(excercisePlan.endDate);

    // Ensure `today` is valid before comparison
    if (!(today instanceof Date && !isNaN(today.getTime()))) return false;

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
            excerciseId: exerciseId,
            completed,
            excercisePlanId: excercisePlan.ep_id, 
            date: today.toISOString(), 
          },
        ];
      }
    });
  };

  useEffect(() => {
    if (epid && sessionDate) { // Check required params
        setIsLoading(true);
        getExcerciseTrackingSessionData({
          data: {
            epn_id: note?.epn_id,
            ep_id: epid,
            date: sessionDate,
          },
          afterAPISuccess: (res) => {
            setIsLoading(false);
            // Ensure data structure is as expected before setting state
            const completions = res.excercisePlans?.excercisePlanCompleted || [];
            const notesData = res.excercisePlans?.excercisePlanNotes?.[0];
            setExerciseCompletions(completions);
            setNote(notesData);
            setNoteText(notesData?.notes || "");
          },
          afterAPIFail: (res) => {
            setIsLoading(false);
            showToast("Failed to load session data", DefaultToastTiming, ToastColors.RED);
            console.log(res);
          },
        });
    }
  }, [isExcercisePlanTrackingSessionRefresh, epid, sessionDate, note?.epn_id, showToast]); // Add dependencies

  const handleSubmit = () => {
    if (!epid || !sessionDate) {
        showToast("Cannot submit, session data missing.", DefaultToastTiming, ToastColors.RED);
        return;
    }
    setIsLoading(true); // Indicate loading during submission
    const completionPromise = saveExcerciseCompletionData({
      data: exerciseCompletions,
      afterAPISuccess: (res) => {
        console.log("Completion saved:", res);
      },
      afterAPIFail: (res) => {
        showToast("Failed to save tracking data", DefaultToastTiming, ToastColors.RED)
        console.error("Completion save failed:", res);
      },
    });
    const notesPromise = saveExcercisePlanNotes({
      data: {
        epn_id: note?.epn_id,
        notes: noteText,
        ep_id: epid,
        date: sessionDate,
      },
      afterAPISuccess: (res) => {
        console.log("Notes saved:", res);
      },
      afterAPIFail: (res) => {
        showToast("Failed to save notes", DefaultToastTiming, ToastColors.RED);
        console.error("Notes save failed:", res);
      },
    });

    Promise.all([completionPromise, notesPromise])
      .then(() => {
        showToast("Session data submitted successfully!", DefaultToastTiming, ToastColors.GREEN);
      })
      .catch(() => {
        // Errors are handled individually by showToast in afterAPIFail
      })
      .finally(() => {
        setIsLoading(false); // Stop loading indicator
      });
  };

  if (!excercisePlan || !isTodayInSession) {
    // Provide a more informative message or loading state
    return (
      <TrackSessionContainer align="center" justify="center">
        <Text color="gray">
          {excercisePlan ? "Today is not a scheduled session day." : "Loading session data..."}
        </Text>
      </TrackSessionContainer>
    );
  }

  return (
    <ScrollArea style={{ height: 'calc(100vh - 60px)' }}>
      <TrackSessionContainer>
        <ExercisesCard>
          <Heading mb="3">Today's Exercises ({today.toLocaleDateString()})</Heading>
          {excercisePlan.excercise.map((exercise: iExcerciseDataDto) => (
            <ExerciseItem key={exercise.e_id}>
              <Skeleton loading={isLoading}>
                <Text as="label" htmlFor={exercise.e_id} style={{ flexGrow: 1 }}>{exercise.excercise_name}</Text>
              </Skeleton>
              <Skeleton loading={isLoading}>
                <Checkbox
                  id={exercise.e_id}
                  checked={
                    exerciseCompletions.find(
                      (item) => item.excerciseId === exercise.e_id
                    )?.completed || false
                  }
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(exercise.e_id, !!checked)
                  }
                />
              </Skeleton>
            </ExerciseItem>
          ))}
        </ExercisesCard>

        <NotesCard>
          <Heading mb="3">Session Notes</Heading>
          <Skeleton loading={isLoading}>
            <StyledTextArea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add notes for today's session..."
            />
          </Skeleton>
        </NotesCard>

        <SubmitButtonContainer>
            <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Session Data"}
            </Button>
        </SubmitButtonContainer>

      </TrackSessionContainer>
    </ScrollArea>
  );
};

export default ExcercisePlanTrackSession;
