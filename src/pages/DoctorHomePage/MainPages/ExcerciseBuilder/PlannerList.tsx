import React, { Suspense, useRef } from "react";
import { iExcerciseDataDto } from "../../../../models/ExcerciseInterface";
import { PlannerItem } from "./PlannerItem";
import { Flex, Heading, Box, Button } from "@radix-ui/themes";
import ThemeColorPallate from "../../../../assets/ThemeColorPallate";
import { DoctorHomeMainScreen, useCurrentMainScreenContext } from "../../DoctorHomePage";
import { useNavigate } from "react-router-dom";
import { styled } from "@stitches/react";

const PlannerContainer = styled(Flex, {
  width: '100%',
  height: '100%',
  backgroundColor: ThemeColorPallate.foreground,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '16px',
  gap: '16px',

  '@media (max-width: 992px)': {
    minHeight: '60vh',
    maxHeight: '80vh',
  }
});

const PlannerContent = styled(Box, {
  width: '100%',
  flex: 1,
  overflowY: 'auto',
  padding: '8px',
  
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: ThemeColorPallate.primary,
    borderRadius: '4px',
  }
});

const CreatePlanButton = styled(Button, {
  width: '100%',
  marginTop: 'auto',
  backgroundColor: ThemeColorPallate.primary,
  color: 'white',
  padding: '12px',
  borderRadius: '8px',
  transition: 'transform 0.2s ease',

  '&:hover': {
    transform: 'scale(1.02)',
  },

  '@media (max-width: 992px)': {
    position: 'sticky',
    bottom: 0,
  }
});

export interface PlannerListProps {
  isPDFPreviewModelRequired: boolean;
  setIsPDFPreviewModelRequired: React.Dispatch<React.SetStateAction<boolean>>;
  testId: string;
}

export const PlannerList = (inputs: PlannerListProps) => {
  const {
    breadCrumbItems,
    setBreadCrumbItems,
    currentPatientDetails,
    excerciseBuilderPlannerList,
    setExcerciseBuilderPlannerList,
    setCurrentMainScreen,
  } = useCurrentMainScreenContext();
  
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

  const handleCreateExcercisePlan = () => {
    navigate(
      `/doctorhome/main/patientDetails/${currentPatientDetails?.p_id}/buildPlan/createPlan`
    );

    setCurrentMainScreen(DoctorHomeMainScreen.CREATE_EXCERCISE_PLAN);
    setBreadCrumbItems([
      {
        label: "Patient Details",
        onClick: () => {
          navigate(`/doctorhome/main/patientDetails/${currentPatientDetails?.p_id}`);
          breadCrumbItems.pop();
          setBreadCrumbItems(breadCrumbItems);
        },
      },
      {
        label: "Exercise Builder",
        onClick: () => {
          navigate(`/doctorhome/main/patientDetails/${currentPatientDetails?.p_id}/buildPlan`);
          setBreadCrumbItems(breadCrumbItems);
        },
      },
      {
        label: "Create Exercise Plan",
        onClick: () => {
          navigate(`/doctorhome/main/patientDetails/${currentPatientDetails?.p_id}/buildPlan/createPlan`);
        },
      },
    ]);
  };

  return (
    <PlannerContainer data-testid={inputs.testId} ref={plannerListRef}>
      <Heading size="6" style={{ color: 'rgb(241, 245, 249)' }}>
        Patient Plan ({excerciseBuilderPlannerList.length})
      </Heading>
      
      <PlannerContent>
        <Suspense fallback={<div>Loading...</div>}>
          {excerciseBuilderPlannerList.length === 0 ? (
            <Box style={{ textAlign: 'center', color: 'rgb(156, 163, 175)', padding: '24px' }}>
              No exercises added yet
            </Box>
          ) : (
            excerciseBuilderPlannerList.map((exercise, i) => (
              <PlannerItem
                key={i}
                excercise={exercise}
                plannerListRef={plannerListRef}
                onDelete={onDelete}
              />
            ))
          )}
        </Suspense>
      </PlannerContent>

      <CreatePlanButton variant="surface" size="3" onClick={handleCreateExcercisePlan}>
        Create Plan
      </CreatePlanButton>
    </PlannerContainer>
  );
};
