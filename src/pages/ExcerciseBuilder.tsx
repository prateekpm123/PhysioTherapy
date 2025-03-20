import { Suspense, useEffect, useState } from "react";
import { ExcerciseTile } from "../components/ExcerciseTile";
import { ExcerciseType, iExcerciseData } from "../models/ExcerciseInterface";
import { PlannerList } from "../components/PlannerList";
import { ExcerciseDetail } from "../components/ExcerciseDetail";
import Modal from "../components/Modal";
import { PDFPreview } from "../components/PDFPreview";
import { IoMdAdd } from "react-icons/io";
import { AddExcercise } from "../components/AddExcercise";
import DatabaseController from "../databaseConnections/DatabaseController";
import { EditExcercise } from "../components/EditExcercise";
import { isMobile } from "react-device-detect";
import React from "react";
import { act } from "@testing-library/react";
import { Box, Flex, TextField, Button } from "@radix-ui/themes";

export const ExcerciseBuilder = () => {
  const [data2, setData2] = useState<iExcerciseData[] | null>();
  const [excercises, setExcercises] = useState<iExcerciseData[]>();
  const [plannerItems, setPlannerItems] = useState<iExcerciseData[]>([]);
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
    useState<iExcerciseData>();
  const [currentExcerciseTileEditClick, setCurrentExcerciseTileEditClick] =
    useState<iExcerciseData>();

  const search = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    if (searchValue === "" && data2) {
      setExcercises(data2);
      return;
    }
    const filteredExcercises = data2?.filter((excercise) => {
      return excercise.name.toLowerCase().includes(searchValue.toLowerCase());
    });
    setExcercises(filteredExcercises);
  };

  const onAdd = (clickedExcercise: iExcerciseData) => {
    setPlannerItems((plannerItems) => [...plannerItems, clickedExcercise]);
  };

  const onExcerciseTileForDetailClicked = (
    excercise: iExcerciseData,
    excerciseKey: string
  ) => {
    excercise.excerciseKey = excerciseKey;
    setCurrentClickedExcerciseTile(excercise);
    setIsExcerciseDetailModalOpen(true);
  };

  const fetchExcerciseData = () => {
    const db = DatabaseController.getInstance();
    const data = db.fetchNodeData("excercises");
    data
      .then((data) => {
        if (data) {
          act(() => {
            setData2(data);
            setExcercises(data);
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const onAddExcerciseClick = () => {
    setIsAddExcerciseModalOpen(true);
  };

  // const onPlannerListCounterBtnClick = () => {
  //   setIsPlannerListModalOpen(true);
  // };

  const onEditExcerciseClick = (
    excercise: iExcerciseData,
    excerciseKey: string
  ) => {
    excercise.excerciseKey = excerciseKey;
    setCurrentExcerciseTileEditClick(excercise);
    setIsEditExcerciseModalOpen(true);
  };

  useEffect(() => {
    fetchExcerciseData();
  }, []);

  return (
    <Flex direction="row" className="h-screen">
      <Flex
        direction="column"
        className="bg-slate-800"
        style={{
          flex: isMobile ? "1 1 100%" : "5 1 0%",
          padding: isMobile ? "12px" : "32px",
        }}
      >
        <Box
          className="overflow-y-auto"
          style={{
            display: "grid",
            gap: "16px",
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
        <Button
          variant="soft"
          size="3"
          style={{
            position: "absolute",
            bottom: "10%",
            right: isMobile ? "3%" : "19%",
            borderRadius: "50%",
            boxShadow: "1px 2px 44px 5px rgba(0,0,0,0.75)",
          }}
          onClick={onAddExcerciseClick}
        >
          <IoMdAdd className="text-6xl text-slate-700" />
        </Button>
        <TextField.Root
          placeholder="Search"
          size="3"
          radius="full"
          style={{
            position: "fixed", // Sticks to the bottom
            bottom: "0", // Aligns to the bottom of the screen
            left: "0",
            width: "100%", // Full width
            height: "60px", // Increased height
            backgroundColor: "rgba(46, 47, 80, 1)",
            color: "white",
            padding: "10px",
            boxSizing: "border-box",
          }}
          onChange={(e) => search(e as React.ChangeEvent<HTMLInputElement>)}
        />
      </Flex>
      {!isMobile && (
        <Box style={{ flex: "1 1 0%", padding: "16px" }}>
          <PlannerList
            testId={"homePlannerList"}
            isPDFPreviewModelRequired={isPDFPreviewModalOpen}
            setIsPDFPreviewModelRequired={setIsPDFPreviewModalOpen}
            plannerItems={plannerItems}
            setPlannerItems={setPlannerItems}
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
              isOpen={isExcerciseDetailModalOpen}
              setIsModelOpen={setIsExcerciseDetailModalOpen}
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
          <PDFPreview plannerList={plannerItems} />
        </Modal>
      )}
      {isAddExcerciseModalOpen && (
        <Modal
          testId={"AddExcerciseModal"}
          title={"Add Excercise"}
          pIsOpen={isAddExcerciseModalOpen}
          setIsModelOpen={setIsAddExcerciseModalOpen}
        >
          <AddExcercise refreshExcercise={fetchExcerciseData} />
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
            refreshExcercise={fetchExcerciseData}
            excercise={currentExcerciseTileEditClick}
            excerciseKey={
              currentExcerciseTileEditClick
                ? currentExcerciseTileEditClick.excerciseKey
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
            plannerItems={plannerItems}
            setPlannerItems={setPlannerItems}
          ></PlannerList>
        </Modal>
      )}
    </Flex>
  );
};

export const Home2 = () => {
  return <div>testing</div>;
};
