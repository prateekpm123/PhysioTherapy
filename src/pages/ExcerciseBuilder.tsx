import { Suspense, useEffect, useState } from "react";
import { ExcerciseTile } from "../components/ExcerciseTile";
import { ExcerciseType, iExcerciseDataDto } from "../models/ExcerciseInterface";
import { PlannerList } from "../components/PlannerList";
import { ExcerciseDetail } from "../components/ExcerciseDetail";
import Modal from "../components/Modal";
import { PDFPreview } from "../components/PDFPreview";
// import { IoMdAdd } from "react-icons/io";
import { AddExcercise } from "../components/AddExcercise";
import { EditExcercise } from "../components/EditExcercise";
import { isMobile } from "react-device-detect";
import React from "react";
import { Box, Flex, TextField } from "@radix-ui/themes";
import { getAllExcercises } from "../controllers/ExcerciseController";
import ThemeColorPallate from "../assets/ThemeColorPallate";
import { useCurrentMainScreenContext } from "./DoctorHomePage/DoctorHomePage";

export const ExcerciseBuilder = () => {
  const [data2, setData2] = useState<iExcerciseDataDto[] | null>();
  const [excercises, setExcercises] = useState<iExcerciseDataDto[]>();
  // const [plannerItems, setPlannerItems] = useState<iExcerciseDataDto[]>([]);
  const {isExcerciseBuilderRefresh, setIsExcerciseBuilderLoading, excerciseBuilderPlannerList, setExcerciseBuilderPlannerList} = useCurrentMainScreenContext();
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
  const [currentExcerciseTileEditClick, setCurrentExcerciseTileEditClick] =
    useState<iExcerciseDataDto>();

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
    setExcerciseBuilderPlannerList((excerciseBuilderPlannerList) => [...excerciseBuilderPlannerList, clickedExcercise]);
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
    setCurrentExcerciseTileEditClick(excercise);
    setIsEditExcerciseModalOpen(true);
  };

  useEffect(() => {
    fetchExcerciseData();
  }, [isExcerciseBuilderRefresh]);

  return (
    <Flex direction="row" className="h-screen" width="100%"  height="100%">
      <Flex
        direction="column"
        width="100%"  height="100%"
        // className="bg-slate-800"
        // style={{
        //   flex: isMobile ? "1 1 100%" : "5 1 100%",
        //   padding: isMobile ? "12px" : "32px",
        // }}
      >
        <Box
          style={{
            display: "grid",
            gap: "16px",
            width:"100%",
            height: "100%",
            maxHeight:"80vh",
            overflow: "auto",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "repeat(auto-fill, minmax(280px, 1fr))",
          }}
        >
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
                  viewType={
                    isMobile
                      ? ExcerciseType.MOBILE_VIEW
                      : ExcerciseType.FULL_VIEW
                  }
                />
              ))}
          </Suspense>
        </Box>
        <AddExcercise/>
        <TextField.Root
          placeholder="Search"
          size="3"
          radius="full"
          style={{
            position: "relative", // Sticks to the bottom
            bottom: "0", // Aligns to the bottom of the screen
            left: "0",
            width: "100%", // Full width
            height: "60px", // Increased height
            backgroundColor: ThemeColorPallate.background,
            color: "white",
            padding: "10px",
            boxSizing: "border-box",
          }}
          onChange={(e) => search(e as React.ChangeEvent<HTMLInputElement>)}
        />
      </Flex>
      {!isMobile && (
        <Box style={{ flex: "1 1 35%", marginLeft: "12px", boxShadow: "-9px 0px 15px 0px rgba(0,0,0,0.75)", minWidth:"20rem" }}>
          <PlannerList
            testId={"homePlannerList"}
            isPDFPreviewModelRequired={isPDFPreviewModalOpen}
            setIsPDFPreviewModelRequired={setIsPDFPreviewModalOpen}
          />
        </Box>
      )}
      {/* Modals */}
      {isExcerciseDetailModalOpen && (
        <Modal
          testId={"ExcerciseDetailModal"}
          title={"Excercise Detail"}
          pIsOpen={isExcerciseDetailModalOpen}
          setIsModelOpen={setIsExcerciseDetailModalOpen}
        >
          {currentClickedExcerciseTile && (
            <ExcerciseDetail
              excercise={currentClickedExcerciseTile}
            />
          )}
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
            excercise={currentExcerciseTileEditClick}
            e_id={
              currentExcerciseTileEditClick
                ? currentExcerciseTileEditClick.e_id
                : ""
            }
          />
        </Modal>
      )}
      {isPlannerListModalOpen && (
        <Modal
          testId={"PlannerListModal"}
          title={"Planner list"}
          pIsOpen={isPlannerListModalOpen}
          setIsModelOpen={setIsPlannerListModalOpen}
        >
          <PlannerList
            testId={"mobilFullPlannerList"}
            isPDFPreviewModelRequired={isPDFPreviewModalOpen}
            setIsPDFPreviewModelRequired={setIsPDFPreviewModalOpen}
          ></PlannerList>
        </Modal>
      )}
    </Flex>
  );
};

export const Home2 = () => {
  return <div>testing</div>;
};
