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
import { Button, Card, Flex, Grid, Heading, Skeleton, Text } from "@radix-ui/themes";
// import { iExcercisePlanDto } from "../../../models/ExcerciseInterface";
// import { useCurrentMainScreenContext } from "../DoctorHomePage";

import React, { createContext, useContext } from "react";
import { useCurrentMainScreenContext } from "../DoctorHomePage";
import { DefaultToastTiming, useToast } from "../../../stores/ToastContext";
import { ToastColors } from "../../../components/Toast";

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

const ExcercisePlanDetailsPage = () => {
  const { epid, pid } = useParams();
  const { isExcercisePlanTrackingRefresh, isExcercisePlanTrackingLoading, setIsExcercisePlanTrackingLoading } = useCurrentMainScreenContext();
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
      },
      afterAPIFail(res) {
        setIsExcercisePlanTrackingLoading(false);
        console.log(res);
      },
    });
  }, [epid, isExcercisePlanTrackingRefresh]);

  const onTrackTodaySession = () => {
    navigate(
      "/doctorhome/main/patientDetails/" +
        pid +
        "/excercisePlans/" +
        epid +
        "/trackSession",
      {
        state: {
          excercisePlan: excercisePlan,
          sessionDate: new Date()
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
      <div>
        <h1>Excercise Plan Details</h1>
        <Flex direction="column" gap="4" justify="center" align="center">
          <Skeleton loading={isExcercisePlanTrackingLoading}>
            <WeeklyCarousel
              excercises={excercisePlan?.excercise || []}
              startDate={startDate}
              endDate={endDate}
              selectedDays={excercisePlan?.selected_days || ""}
              excercisePlan={excercisePlan}
              onChange={onFullTrackSubmission}
            />
          </Skeleton>
          
          <Skeleton loading={isExcercisePlanTrackingLoading}>
            <Button
              style={{ width: "200px" }}
              variant="classic"
              onClick={() => onTrackTodaySession()}
            >
              Track Today's workout
            </Button>
            <Button
              style={{ width: "200px" }}
              variant="classic"
              onClick={sumbitExcerciseCompletionData}
            >
              Submit so far !
            </Button>
          </Skeleton>

          <Skeleton loading={isExcercisePlanTrackingLoading}>
            {excercisePlan?.excercise_plan_notes && (
              <Grid columns={"2"}>
                {excercisePlan.excercise_plan_notes.map((note: iExcercisePlanNote) => (
                  <Card key={note.epn_id}>
                    <Heading size="3">Note:</Heading>
                    <Text>{note.notes}</Text>
                    <Text size={'2'}>Date: {new Date(note.date).toLocaleDateString()}</Text>
                  </Card>
                ))}
              </Grid>
            )}
          </Skeleton>
          {/* Add your content here */}
        </Flex>
      </div>
    </ExcercisePlanDetailsContext.Provider>
  );
};

export default ExcercisePlanDetailsPage;
