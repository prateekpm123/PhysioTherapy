import React, { Suspense, useRef } from "react";
import { iExcerciseDataDto } from "../../../../models/ExcerciseInterface";
import { PlannerItem } from "./PlannerItem";
import { Flex, Heading, Box, Button } from "@radix-ui/themes";
import ThemeColorPallate from "../../../../assets/ThemeColorPallate";
// import { useNavigate } from "react-router-dom";
// import CreateExcercisePlanPage from "../pages/CreateExcercisePlanPage";
import { DoctorHomeMainScreen, useCurrentMainScreenContext } from "../../DoctorHomePage";
import { useNavigate } from "react-router-dom";
// import { saveExcercisePlan } from "../controllers/ExcerciseController";
// import { useCurrentMainScreenContext } from "../pages/DoctorHomePage/DoctorHomePage";
// import { useSelector } from "react-redux";
// import { UserSessionStateType } from "../stores/userSessionStore";

export interface PlannerListProps {
  isPDFPreviewModelRequired: boolean;
  setIsPDFPreviewModelRequired: React.Dispatch<React.SetStateAction<boolean>>;
  testId: string;
}

export const PlannerList = (inputs: PlannerListProps) => {
  const {breadCrumbItems, setBreadCrumbItems, currentPatientDetails, excerciseBuilderPlannerList, setExcerciseBuilderPlannerList, setCurrentMainScreen} = useCurrentMainScreenContext();
  const plannerListRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const onDelete = (excercise: iExcerciseDataDto) => {
    const index = excerciseBuilderPlannerList.findIndex(
      (item) => item.excercise_name === excercise.excercise_name
    );
    excerciseBuilderPlannerList.splice(index, 1);
    if (setExcerciseBuilderPlannerList) {
      setExcerciseBuilderPlannerList([...excerciseBuilderPlannerList]);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const previewPDF = () => {
    inputs.setIsPDFPreviewModelRequired(true);
  };


  const handleCreateExcercisePlan = () =>{
    navigate("/doctorhome/main/patientDetails/"+ currentPatientDetails?.p_id + "/buildPlan/createPlan");

    // setCurrentMainScreen(DoctorHomeMainScreen.CREATE_EXCERCISE_PLAN);
    setBreadCrumbItems(
      [
        {
          label: "Patient Details",
          onClick: () => {
            setCurrentMainScreen(DoctorHomeMainScreen.PATIENT_DETAILS);
            breadCrumbItems.pop();
            // breadCrumbItems.pop();
            setBreadCrumbItems(breadCrumbItems);
          },
        },
        {
          label: "Exercise Builder",
          onClick: () => {
            setCurrentMainScreen(DoctorHomeMainScreen.EXCERCISE_BUILDER);
            // breadCrumbItems.pop();
            setBreadCrumbItems(breadCrumbItems);
            // const 
            // setBreadCrumbItems()
          },
        },
        {
          label: "Create Excercise Plan",
          onClick: () => {
            setCurrentMainScreen(DoctorHomeMainScreen.CREATE_EXCERCISE_PLAN);
          },
        }
      ]
    )
  }
  

  return (
    <Flex
      direction="column"
      align="center"
      justify="start"
      width="100%"
      p="3"
      height="100%"
      style={{ backgroundColor: ThemeColorPallate.foreground }} // Equivalent to bg-slate-600
      data-testid={inputs.testId}
      ref={plannerListRef}
    >
      <Heading size="6" color="gray" style={{ color: "rgb(241, 245, 249)" }}>
        Patient Plan
      </Heading>
      <Box style={{ height: "95%", width: "100%", maxHeight: "100dvh" }}>
        <Suspense fallback={<div>Loading...</div>}>
          {excerciseBuilderPlannerList.map((_, i) => (
            <PlannerItem
              key={i}
              excercise={excerciseBuilderPlannerList[i]}
              plannerListRef={plannerListRef}
              onDelete={onDelete}
            />
          ))}
        </Suspense>
      </Box>
      {/* <CreateExcercisePlanPage
        exercises={excerciseBuilderPlannerList}
      /> */}
      <Button
        variant="surface"
        size="3"
        style={{ width: "100%" }}
        onClick={handleCreateExcercisePlan}
      >
        Create Plan
      </Button>
    </Flex>
  );
};
