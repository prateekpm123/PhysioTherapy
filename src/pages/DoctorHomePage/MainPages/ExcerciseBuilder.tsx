import { Suspense, useEffect, useState } from "react";
import { ExcerciseTile } from "./ExcerciseBuilder/ExcerciseTile";
import {
  ExcerciseType,
  iExcerciseDataDto,
} from "../../../models/ExcerciseInterface";
import { PlannerList } from "./ExcerciseBuilder/PlannerList";
import { ExcerciseDetail } from "./ExcerciseBuilder/ExcerciseDetail";
import Modal from "../../../components/Modal";
import { PDFPreview } from "../../../components/PDFPreview";
// import { IoMdAdd } from "react-icons/io";
import { AddExcercise } from "./ExcerciseBuilder/AddExcercise";
import { EditExcercise } from "./ExcerciseBuilder/EditExcercise";
import React from "react";
import { Box, Button, TextField } from "@radix-ui/themes";
import { getAllExcercises } from "../../../controllers/ExcerciseController";
import ThemeColorPallate from "../../../assets/ThemeColorPallate";
import { useCurrentMainScreenContext } from "../DoctorHomePage";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { DefaultToastTiming, useToast } from "../../../stores/ToastContext";
import { ToastColors } from "../../../components/Toast";
import { IoMdAdd } from "react-icons/io";
import { styled } from "@stitches/react";

const BuilderContainer = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  height: '100vh',
  position: 'relative',
  backgroundColor: ThemeColorPallate.background,
});

const MainContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  padding: '20px',
  position: 'relative',

  '@media (max-width: 768px)': {
    padding: '12px',
  }
});

const ExerciseGrid = styled(Box, {
  display: 'grid',
  gap: '16px',
  width: '100%',
  height: '100%',
  maxHeight: 'calc(100vh - 140px)', // Account for search bar and padding
  overflow: 'auto',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  padding: '8px',

  '@media (max-width: 768px)': {
    gridTemplateColumns: '1fr',
    gap: '12px',
  }
});

const SearchContainer = styled('div', {
  position: 'sticky',
  bottom: 0,
  left: 0,
  width: '100%',
  padding: '16px',
  backgroundColor: ThemeColorPallate.background,
  boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.1)',
  zIndex: 10,

  '@media (max-width: 768px)': {
    padding: '12px',
  }
});

const AddButton = styled(Button, {
  position: 'fixed',
  bottom: '80px',
  right: '20px',
  borderRadius: '50%',
  width: '56px',
  height: '56px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  transition: 'transform 0.2s ease',
  zIndex: 20,

  '&:hover': {
    transform: 'scale(1.05)',
  },

  '@media (max-width: 768px)': {
    bottom: '90px',
    right: '16px',
    width: '48px',
    height: '48px',
  }
});

const CounterButton = styled('button', {
  position: 'fixed',
  bottom: '80px',
  left: '20px',
  borderRadius: '50%',
  width: '56px',
  height: '56px',
  backgroundColor: ThemeColorPallate.primary,
  color: 'white',
  display: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '20px',
  fontWeight: 'bold',
  border: 'none',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  transition: 'transform 0.2s ease',
  zIndex: 20,

  '&:hover': {
    transform: 'scale(1.05)',
  },

  '@media (max-width: 992px)': {
    display: 'flex',
    bottom: '90px',
    left: '16px',
    width: '48px',
    height: '48px',
  }
});

const PlannerSidebar = styled(Box, {
  flex: '0 0 350px',
  marginLeft: '12px',
  boxShadow: '-4px 0px 15px rgba(0, 0, 0, 0.15)',
  backgroundColor: ThemeColorPallate.background,
  
  '@media (max-width: 992px)': {
    display: 'none',
  }
});

export const ExcerciseBuilder = () => {
  const [data2, setData2] = useState<iExcerciseDataDto[] | null>();
  const [excercises, setExcercises] = useState<iExcerciseDataDto[]>();
  // const [plannerItems, setPlannerItems] = useState<iExcerciseDataDto[]>([]);
  const {
    isExcerciseBuilderRefresh,
    setIsExcerciseBuilderLoading,
    excerciseBuilderPlannerList,
    setExcerciseBuilderPlannerList,
  } = useCurrentMainScreenContext();
  const { showToast } = useToast();
  const [isPlannerListModalOpen, setIsPlannerListModalOpen] =
    useState<boolean>(false);
  const [isExcerciseDetailModalOpen, setIsExcerciseDetailModalOpen] =
    useState<boolean>(false);
  const [isPDFPreviewModalOpen, setIsPDFPreviewModalOpen] =
    useState<boolean>(false);
  const [isAddExcerciseModalOpen, setIsAddExcerciseModalOpen] =
    useState<boolean>(false);
  const [isEditExcerciseModalOpen, setIsEditExcerciseModalOpen] =
    useState<boolean>(false);
  const [currentClickedExcerciseTile, setCurrentClickedExcerciseTile] =
    useState<iExcerciseDataDto>();
  const [currentExcerciseTile, setCurrentExcerciseTile] = useState<iExcerciseDataDto | null>(null);

    const navigate = useNavigate();
    const {pid} = useParams();

  const search = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    if (searchValue === "" && data2) {
      setExcercises(data2);
      return;
    }
    const filteredExcercises = data2?.filter((excercise) => {
      return excercise.excercise_name
        .toLowerCase()
        .includes(searchValue.toLowerCase());
    });
    setExcercises(filteredExcercises);
  };

  const onAdd = (clickedExcercise: iExcerciseDataDto) => {
    // Check if the excercise is already added
    if (
      excerciseBuilderPlannerList.find(
        (item) => item.e_id === clickedExcercise.e_id
      )
    ) {
      showToast(
        "Excercise already added",
        DefaultToastTiming,
        ToastColors.YELLOW
      );
      console.log(currentExcerciseTile);
      return;
    }
    setExcerciseBuilderPlannerList((excerciseBuilderPlannerList) => [
      ...excerciseBuilderPlannerList,
      clickedExcercise,
    ]);
  };

  const onExcerciseTileForDetailClicked = (
    excercise: iExcerciseDataDto,
    excerciseKey: string
  ) => {
    excercise.e_id = excerciseKey;
    setCurrentClickedExcerciseTile(excercise);
    setIsExcerciseDetailModalOpen(true);
  };

  const fetchExcerciseData = () => {
    setIsExcerciseBuilderLoading(true);
    getAllExcercises({
      data: {},
      afterAPISuccess: (response) => {
        setData2(response.excercises);
        setExcercises(response.excercises);
        setIsExcerciseBuilderLoading(false);
        // setPatients(response.patients);
        // setIsLoading(false);
        console.log(response);
      },
      afterAPIFail: (response) => {
        // ErrorHandler(response);
        // setIsLoading(false);
        console.log(response);
        setIsExcerciseBuilderLoading(false);
      },
    });
  };

  // const onAddExcerciseClick = () => {
  //   setIsAddExcerciseModalOpen(true);
  // };

  // const onPlannerListCounterBtnClick = () => {
  //   setIsPlannerListModalOpen(true);
  // };

  const onEditExcerciseClick = (
    excercise: iExcerciseDataDto,
    excerciseKey: string
  ) => {
    excercise.e_id = excerciseKey;
    setCurrentExcerciseTile(excercise);
    setIsEditExcerciseModalOpen(true);
  };

  useEffect(() => {
    fetchExcerciseData();
  }, [isExcerciseBuilderRefresh]);

  return (
    <>
      <Outlet />
      <BuilderContainer>
        <MainContent>
          <ExerciseGrid>
            <Suspense fallback={<div>Loading...</div>}>
              {excercises &&
                Object.entries(excercises).map(([key, excercise]) => (
                  <ExcerciseTile
                    key={key}
                    excerciseKey={key}
                    excercise={excercise}
                    onAdd={onAdd}
                    onEdit={() => onEditExcerciseClick(excercise, key)}
                    onExcerciseTileClick={onEditExcerciseClick}
                    onClick={() =>
                      onExcerciseTileForDetailClicked(excercise, key)
                    }
                    refreshExcercise={fetchExcerciseData}
                    viewType={ExcerciseType.FULL_VIEW}
                  />
                ))}
            </Suspense>
          </ExerciseGrid>
          
          <AddButton 
            variant="solid" 
            onClick={() => navigate(`/doctorhome/main/patientDetails/${pid}/buildPlan/addExcercise`)}
          >
            <IoMdAdd size={24} style={{ color: ThemeColorPallate.cardFontColorBlack }} />
          </AddButton>

          <CounterButton onClick={() => setIsPlannerListModalOpen(true)}>
            {excerciseBuilderPlannerList.length}
          </CounterButton>

          <SearchContainer>
            <TextField.Root
              placeholder="Search exercises..."
              size="3"
              radius="full"
              style={{
                width: '100%',
                backgroundColor: ThemeColorPallate.background,
                color: 'white',
              }}
              onChange={(e) => search(e as React.ChangeEvent<HTMLInputElement>)}
            />
          </SearchContainer>
        </MainContent>

        <PlannerSidebar>
          <PlannerList
            testId={"homePlannerList"}
            isPDFPreviewModelRequired={isPDFPreviewModalOpen}
            setIsPDFPreviewModelRequired={setIsPDFPreviewModalOpen}
          />
        </PlannerSidebar>

        {/* Mobile Planner List Modal */}
        {isPlannerListModalOpen && (
          <Modal
            testId={"PlannerListModal"}
            title={"Patient Plan"}
            pIsOpen={isPlannerListModalOpen}
            setIsModelOpen={setIsPlannerListModalOpen}
          >
            <PlannerList
              testId={"mobilePlannerList"}
              isPDFPreviewModelRequired={isPDFPreviewModalOpen}
              setIsPDFPreviewModelRequired={setIsPDFPreviewModalOpen}
            />
          </Modal>
        )}

        {/* Other Modals */}
        {isExcerciseDetailModalOpen && (
          <Modal
            testId={"ExcerciseDetailModal"}
            title={"Exercise Detail"}
            pIsOpen={isExcerciseDetailModalOpen}
            setIsModelOpen={setIsExcerciseDetailModalOpen}
          >
            {currentClickedExcerciseTile && <ExcerciseDetail />}
          </Modal>
        )}
        {isPDFPreviewModalOpen && (
          <Modal
            testId={"ExcerciseDetailModal"}
            title={"PDF Preview"}
            pIsOpen={isPDFPreviewModalOpen}
            setIsModelOpen={setIsPDFPreviewModalOpen}
          >
            <PDFPreview plannerList={excerciseBuilderPlannerList} />
          </Modal>
        )}
        {isAddExcerciseModalOpen && (
          <Modal
            testId={"AddExcerciseModal"}
            title={"Add Excercise"}
            pIsOpen={isAddExcerciseModalOpen}
            setIsModelOpen={setIsAddExcerciseModalOpen}
          >
            <AddExcercise />
          </Modal>
        )}
        {isEditExcerciseModalOpen && (
          <Modal
            testId={"EditExcerciseModal"}
            title={"Edit Excercise"}
            pIsOpen={isEditExcerciseModalOpen}
            setIsModelOpen={setIsEditExcerciseModalOpen}
          >
            <EditExcercise
            // excercise={currentExcerciseTileEditClick}
            // e_id={
            //   currentExcerciseTileEditClick
            //     ? currentExcerciseTileEditClick.e_id
            //     : ""
            // }
            />
          </Modal>
        )}
      </BuilderContainer>
    </>
  );
};

export const Home2 = () => {
  return <div>testing</div>;
};
