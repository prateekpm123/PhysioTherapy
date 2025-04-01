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
} from "../../../models/ExcerciseInterface";
import WeeklyCarousel from "../../../components/WeeklyCarousel";
import { Button, Flex } from "@radix-ui/themes";
// import { iExcercisePlanDto } from "../../../models/ExcerciseInterface";
// import { useCurrentMainScreenContext } from "../DoctorHomePage";

import React, { createContext, useContext } from "react";

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
  const [excercisePlan, setExcercisePlan] = useState<iExcercisePlanDto>();
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [excerciseCompletionData, setExcerciseCompletionData] = useState<
    iExcerciseCompletionDto[]
  >([]);
  const navigate = useNavigate();
  // const { } = useCurrentMainScreenContext();
  useEffect(() => {
    getExcercisePlan({
      data: {
        ep_id: epid,
      },
      afterAPISuccess: (res) => {
        setExcercisePlan(res.excercisePlans);
        setExcerciseCompletionData(res.excercisePlans.excercise_completion);
        setStartDate(new Date(res.excercisePlans.startDate));
        setEndDate(new Date(res.excercisePlans.endDate));
        console.log(res);
      },
      afterAPIFail(res) {
        console.log(res);
      },
    });
  }, [epid]);

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
        },
      }
    );
  };

  const sumbitExcerciseCompletionData = () => {
    saveExcerciseCompletionData({
      data: excerciseCompletionData,
      afterAPISuccess: (res) => {
        console.log(res);
      },
      afterAPIFail: (res) => {
        console.log(res);
      },
    });
  };

  const onFullTrackSubmission = (
    completionData: iExcerciseCompletionDto[]
  ) => {
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
          <WeeklyCarousel
            excercises={excercisePlan?.excercise || []}
            startDate={startDate}
            endDate={endDate}
            selectedDays={excercisePlan?.selected_days || ""}
            excercisePlan={excercisePlan}
            onChange={onFullTrackSubmission}
          />
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
          {/* Add your content here */}
        </Flex>
      </div>
    </ExcercisePlanDetailsContext.Provider>
  );
};

export default ExcercisePlanDetailsPage;
