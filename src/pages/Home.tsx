import { Suspense, useEffect, useState } from "react";
// import data from "../../database/excerciseDatabase.json";
import { ExcerciseTile } from "../components/ExcerciseTile";
import { ExcerciseType, iExcerciseData } from "../models/ExcerciseInterface";
import { PlannerList } from "../components/PlannerList";
import { ExcerciseDetail } from "../components/ExcerciseDetail";
import Modal from "../components/Modal";
import { PDFPreview } from "../components/PDFPreview";
import { IoMdAdd } from "react-icons/io";
import { AddExcercise } from "../components/AddExcercise";
// import testFirebase from "../databaseConnections/AddingDataToFirebase";
import DatabaseController from "../databaseConnections/DatabaseController";
import { EditExcercise } from "../components/EditExcercise";
import { isMobile } from "react-device-detect";

export const Home = () => {
  const [data2, setData2] = useState<iExcerciseData[]|null>();
  const [excercises, setExcercises] = useState<iExcerciseData[]>();
  const [plannerItems, setPlannerItems] = useState<iExcerciseData[]>([]);
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

  // let currentClickedExcerciseTile: iExcerciseData | undefined = undefined;

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
    // currentClickedExcerciseTile = excercise;
    setIsExcerciseDetailModalOpen(true);
  };

  const fetchExcerciseData = () => {
    const db = DatabaseController.getInstance();
    const data = db.fetchNodeData("excercises");
    data
      .then((data) => {
        if (data) {
          setData2(data);
          setExcercises(data);
          console.log(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        // console.log("Data fetched successfully");
      });
  };

  const onAddExcerciseClick = () => {
    setIsAddExcerciseModalOpen(true);
  };

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
  },[]);

  return (
    <div className="grid grid-cols-6">
      <div
        className={
          isMobile
            ? "col-span-6 flex flex-col-reverse w-full h-screen bg-slate-900 p-3"
            : "col-span-5 flex flex-col-reverse w-full h-screen bg-slate-900 p-8"
        }
      >
        <input
          type="text"
          placeholder="Search"
          className="bg-slate-700 w-full p-4 text-slate-200 text-lg rounded-3xl"
          onChange={(e) => search(e)}
        />
        <div
          className={
            isMobile
              ? "relative grid overflow-y-auto w-full col-span-6 justify-items-start"
              : "relative grid overflow-y-auto w-full gap-4 sm:grid-cols-1 sm:gap-4 md:grid-cols-3 md:gap-4 lg:grid-cols-5 justify-items-start"
          }
        >
          <Suspense fallback={<div>Loading...</div>}></Suspense>
          <Suspense>
            {excercises &&
              Object.entries(excercises).map(([key, excercise]) => (
                <ExcerciseTile
                  key={key} // Use the original key as the key
                  excerciseKey={key} // Use the original key as the key
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
        </div>
        <div
          style={{
            bottom: "10%",
            right: "19%",
            borderRadius: "50%",
            boxShadow: "1px 2px 44px 5px rgba(0,0,0,0.75)",
          }}
          className="absolute flex h-18 w-18 z-20 bg-slate-500 bg-lightblue p-2 rounded shadow-md"
        >
          <IoMdAdd
            className="text-6xl text-slate-700"
            onClick={onAddExcerciseClick}
          />
        </div>
      </div>
      {/* {plannerItems.length == 0 ? null : <PlannerList plannerItems={plannerItems} setPlannerItems={setPlannerItems}></PlannerList>} */}
      {isMobile ? (
        false
      ) : (
        <PlannerList
          isPDFPreviewModelRequired={isPDFPreviewModalOpen}
          setIsPDFPreviewModelRequired={setIsPDFPreviewModalOpen}
          plannerItems={plannerItems}
          setPlannerItems={setPlannerItems}
        ></PlannerList>
      )}
      {/* MODALS FOR THE SCREEN */}
      {isExcerciseDetailModalOpen && (
        <Modal
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
          title={"PDF Preview"}
          pIsOpen={isPDFPreviewModalOpen}
          setIsModelOpen={setIsPDFPreviewModalOpen}
        >
          <PDFPreview plannerList={plannerItems} />
        </Modal>
      )}
      {isAddExcerciseModalOpen && (
        <Modal
          title={"Add Excercise"}
          pIsOpen={isAddExcerciseModalOpen}
          setIsModelOpen={setIsAddExcerciseModalOpen}
        >
          <AddExcercise refreshExcercise={fetchExcerciseData} />
        </Modal>
      )}
      {isEditExcerciseModalOpen && (
        <Modal
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
    </div>
  );
};
