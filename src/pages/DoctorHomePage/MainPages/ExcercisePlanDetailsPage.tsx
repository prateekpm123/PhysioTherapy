import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getExcercisePlan,
  saveExcerciseCompletionData,
} from "../../../controllers/ExcerciseController";
import {
  iExcerciseCompletionData,
  iExcerciseCompletionDto,
  iExcercisePlanDto,
  iExcercisePlanNote,
} from "../../../models/ExcerciseInterface";
import WeeklyCarousel from "../../../components/WeeklyCarousel";
import {
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  Skeleton,
  Text,
  ScrollArea
} from "@radix-ui/themes";
// import { iExcercisePlanDto } from "../../../models/ExcerciseInterface";
// import { useCurrentMainScreenContext } from "../DoctorHomePage";

import React, { createContext, useContext } from "react";
import { useCurrentMainScreenContext } from "../DoctorHomePage";
import { DefaultToastTiming, useToast } from "../../../stores/ToastContext";
import { ToastColors } from "../../../components/Toast";
import { styled } from "@stitches/react";
import { themeColors, spacing } from "../../../theme/theme";

interface iExcercisePlanDetailsContext {
  excercisePlan: iExcercisePlanDto;
  setExcercisePlan: React.Dispatch<React.SetStateAction<iExcercisePlanDto>>;
  excerciseCompletionData: iExcerciseCompletionData[];
  setExcerciseCompletionData: React.Dispatch<
    React.SetStateAction<iExcerciseCompletionDto[]>
  >;
  onSubmit?: (data: {
    excerciseCompletion: { excerciseId: string; completed: boolean }[];
    notes: string;
  }) => void;
}

const ExcercisePlanDetailsContext = createContext<
  iExcercisePlanDetailsContext | undefined
>(undefined);

export const useExcercisePlanDetails = () => {
  const context = useContext(ExcercisePlanDetailsContext);
  if (!context) {
    throw new Error(
      "useExcercisePlanDetails must be used within a ExcercisePlanDetailsProvider"
    );
  }
  return context;
};

const PageContainer = styled(Flex, {
  padding: spacing.lg,
  backgroundColor: themeColors.background.dark,
  minHeight: 'calc(100vh - 60px)', // Adjust based on TopBar height
  flexDirection: 'column',
  gap: spacing.lg,

  "@media (max-width: 768px)": {
    padding: spacing.md,
    gap: spacing.md,
  }
});

const ActionButtonsContainer = styled(Flex, {
  gap: spacing.md,
  marginTop: spacing.md,
  width: '100%',
  maxWidth: '600px', // Limit width on larger screens
  justifyContent: 'center',

  "@media (max-width: 768px)": {
    flexDirection: 'column',
    maxWidth: '100%',
  },

  '& button': {
    flex: 1,
  }
});

const NotesGrid = styled(Grid, {
  width: '100%',
  marginTop: spacing.lg,
  columns: '2',
  gap: spacing.md,

  "@media (max-width: 768px)": {
    columns: '1',
  }
});

const NoteCard = styled(Card, {
  backgroundColor: themeColors.background.elevation1,
  padding: spacing.md,
});

const NoteHeading = styled(Heading, {
  color: themeColors.text.primary,
  marginBottom: spacing.xs,
});

const NoteText = styled(Text, {
  color: themeColors.text.secondary,
});

const ExcercisePlanDetailsPage = () => {
  const { epid, pid } = useParams();
  const {
    isExcercisePlanTrackingRefresh,
    isExcercisePlanTrackingLoading,
    setIsExcercisePlanTrackingLoading,
    setBreadCrumbItems,
    breadCrumbItems,
  } = useCurrentMainScreenContext();
  const [excercisePlan, setExcercisePlan] = useState<iExcercisePlanDto>();
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const { showToast } = useToast();

  const [excerciseCompletionData, setExcerciseCompletionData] = useState<
    iExcerciseCompletionDto[]
  >([]);
  const navigate = useNavigate();
  // const { } = useCurrentMainScreenContext();
  useEffect(() => {
    setIsExcercisePlanTrackingLoading(true);
    getExcercisePlan({
      data: {
        ep_id: epid,
      },
      afterAPISuccess: (res) => {
        setIsExcercisePlanTrackingLoading(false);
        setExcercisePlan(res.excercisePlans);
        setExcerciseCompletionData(res.excercisePlans.excercise_completion);
        setStartDate(new Date(res.excercisePlans.startDate));
        setEndDate(new Date(res.excercisePlans.endDate));
        console.log(res);

        // Set breadcrumbs for Exercise Plan page
        setBreadCrumbItems([
          {
            label: "Patient Details",
            onClick: () => {
              navigate("/doctorhome/main/patientDetails/" + pid);
              breadCrumbItems.pop();
              setBreadCrumbItems(breadCrumbItems);
            },
          },
          {
            label: "Exercise Plan",
          },
        ]);
      },
      afterAPIFail(res) {
        setIsExcercisePlanTrackingLoading(false);
        console.log(res);
      },
    });
  }, [epid, isExcercisePlanTrackingRefresh]);

  const onTrackTodaySession = () => {
    // Set breadcrumbs for Track Session page
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
          navigate(
            "/doctorhome/main/patientDetails/" + pid + "/excercisePlans/" + epid
          );
        },
      },
      {
        label: "Track Session",
      },
    ]);

    navigate(
      "/doctorhome/main/patientDetails/" +
        pid +
        "/excercisePlans/" +
        epid +
        "/trackSession",
      {
        state: {
          excercisePlan: excercisePlan,
          sessionDate: new Date(),
        },
      }
    );
  };

  const sumbitExcerciseCompletionData = () => {
    saveExcerciseCompletionData({
      data: excerciseCompletionData,
      afterAPISuccess: (res) => {
        showToast(
          "Excercise Completion Data Saved",
          DefaultToastTiming,
          ToastColors.GREEN
        );
        console.log(res);
      },
      afterAPIFail: (res) => {
        showToast(
          "Excercise Completion Data Failed",
          DefaultToastTiming,
          ToastColors.RED
        );
        console.log(res);
      },
    });
  };

  const onFullTrackSubmission = (completionData: iExcerciseCompletionDto[]) => {
    setExcerciseCompletionData(completionData);
    console.log(completionData);
  };

  return (
    <ExcercisePlanDetailsContext.Provider
      value={{
        excercisePlan: excercisePlan || ({} as iExcercisePlanDto),
        setExcercisePlan: setExcercisePlan as React.Dispatch<
          React.SetStateAction<iExcercisePlanDto>
        >,
        excerciseCompletionData:
          excerciseCompletionData || ({} as iExcerciseCompletionDto[]),
        setExcerciseCompletionData:
          setExcerciseCompletionData as React.Dispatch<
            React.SetStateAction<iExcerciseCompletionDto[]>
          >,
      }}
    >
      <ScrollArea style={{ height: 'calc(100vh - 60px)' }}>
        <PageContainer align="center">
          <Skeleton loading={isExcercisePlanTrackingLoading} style={{ width: '100%' }}>
            <WeeklyCarousel
              excercises={excercisePlan?.excercise || []}
              startDate={startDate}
              endDate={endDate}
              selectedDays={excercisePlan?.selected_days || ""}
              excercisePlan={excercisePlan}
              onChange={onFullTrackSubmission}
            />
          </Skeleton>

          <ActionButtonsContainer>
            <Skeleton loading={isExcercisePlanTrackingLoading}>
              <Button
                variant="soft"
                onClick={() => onTrackTodaySession()}
                highContrast
              >
                Track Today's workout
              </Button>
            </Skeleton>
            <Skeleton loading={isExcercisePlanTrackingLoading}>
              <Button
                variant="solid"
                onClick={sumbitExcerciseCompletionData}
              >
                Submit Progress
              </Button>
            </Skeleton>
          </ActionButtonsContainer>

          {excercisePlan?.excercise_plan_notes && excercisePlan.excercise_plan_notes.length > 0 && (
            <NotesGrid>
              {excercisePlan.excercise_plan_notes.map(
                (note: iExcercisePlanNote) => (
                  <Skeleton key={note.epn_id} loading={isExcercisePlanTrackingLoading}>
                    <NoteCard>
                      <NoteHeading size="3">
                        Note: {" "}
                        <Text size="2" color="gray">
                          {new Date(note.date).toLocaleDateString()}
                        </Text>
                      </NoteHeading>
                      <NoteText>{note.notes}</NoteText>
                    </NoteCard>
                  </Skeleton>
                )
              )}
            </NotesGrid>
          )}
        </PageContainer>
      </ScrollArea>
    </ExcercisePlanDetailsContext.Provider>
  );
};

export default ExcercisePlanDetailsPage;
