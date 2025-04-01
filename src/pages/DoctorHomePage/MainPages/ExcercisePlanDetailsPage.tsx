import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getExcercisePlan } from "../../../controllers/ExcerciseController";
import { iExcercisePlanDto } from "../../../models/ExcerciseInterface";
import WeeklyCarousel from "../../../components/WeeklyCarousel";
import { Button, Flex } from "@radix-ui/themes";
// import { iExcercisePlanDto } from "../../../models/ExcerciseInterface";
// import { useCurrentMainScreenContext } from "../DoctorHomePage";

import React, { createContext, useContext } from "react";

interface iExcercisePlanDetailsContext {
  onSubmit?: (data: {
    excerciseCompletion: { excerciseId: string; completed: boolean }[];
    notes: string;
  }) => void;
}

const ExcercisePlanDetailsContext = createContext<iExcercisePlanDetailsContext>({});

// export const ExcercisePlanDetailsProvider = ExcercisePlanDetailsContext.Provider;

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
  const navigate = useNavigate();
  // const { } = useCurrentMainScreenContext();
  useEffect(() => {
    getExcercisePlan({
      data: {
        ep_id: epid,
      },
      afterAPISuccess: (res) => {
        setExcercisePlan(res.excercisePlans);
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

  return (
    <ExcercisePlanDetailsContext.Provider value={{}}>
      <div>
        <h1>Excercise Plan Details</h1>
        <Flex direction="column" gap="4" justify="center" align="center">
          <WeeklyCarousel
            excercises={excercisePlan?.excercise || []}
            startDate={startDate}
            endDate={endDate}
            selectedDays={excercisePlan?.selected_days || ""}
            excercisePlan={excercisePlan}
          />
          <Button
            style={{ width: "200px" }}
            variant="classic"
            onClick={() => onTrackTodaySession()}
          >
            Track Today's workout
          </Button>
          {/* Add your content here */}
        </Flex>
      </div>
    </ExcercisePlanDetailsContext.Provider>
  );
};

export default ExcercisePlanDetailsPage;
