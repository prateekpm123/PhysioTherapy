import { Suspense, useState } from "react";
import data from "../../database/excerciseDatabase.json";
import { ExcerciseTile } from "../components/ExcerciseTile";
import { iExcerciseData } from "../models/ExcerciseInterface";
import { PlannerList } from "../components/PlannerList";
import { ExcerciseDetail } from "../components/ExcerciseDetail";
import Modal from "../components/Modal";
import { PDFPreview } from "../components/PDFPreview";
import { IoMdAdd } from "react-icons/io";
import { AddExcercise } from "../components/AddExcercise";

export const Home = () => {
  const data2 = data as unknown as iExcerciseData[];
  const [excercises, setExcercises] = useState<iExcerciseData[]>(data2);
  const [plannerItems, setPlannerItems] = useState<iExcerciseData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isPDFPreviewModalOpen, setIsPDFPreviewModalOpen] =
    useState<boolean>(false);
  const [isAddExcerciseModalOpen, setIsAddExcerciseModalOpen] =
    useState<boolean>(false);
  const [currentClickedExcerciseTile, setCurrentClickedExcerciseTile] =
    useState<iExcerciseData>();

  const search = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    if (searchValue === "") {
      setExcercises(data2);
      return;
    }
    const filteredExcercises = data2.filter((excercise) => {
      return excercise.name.toLowerCase().includes(searchValue.toLowerCase());
    });
    setExcercises(filteredExcercises);
  };

  const onAdd = (clickedExcercise: iExcerciseData) => {
    setPlannerItems((plannerItems) => [...plannerItems, clickedExcercise]);
  };

  const onExcerciseTileClick = (excercise: iExcerciseData) => {
    setCurrentClickedExcerciseTile(excercise);
    setIsModalOpen(true);
  };

  const onAddExcerciseClick = () => {
    setIsAddExcerciseModalOpen(true);
  };

  return (
    <div className="grid grid-cols-6">
      <div className="col-span-5 flex flex-col-reverse w-full h-screen bg-slate-900 p-8">
        <input
          type="text"
          placeholder="Search"
          className="bg-slate-700 w-full p-4 text-slate-200 text-lg rounded-3xl"
          onChange={(e) => search(e)}
        />
        <div className="relative flex grid overflow-y-auto w-full sm:grid-cols-1 sm:gap-4 md:grid-cols-3 md:gap-4 lg:grid-cols-5 justify-items-start">
          <Suspense fallback={<div>Loading...</div>}></Suspense>
          <Suspense>
            {excercises.map((_, i) => (
              <ExcerciseTile
                key={i}
                excercise={excercises[i]}
                onAdd={onAdd}
                onClick={() => onExcerciseTileClick(excercises[i])}
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
      <PlannerList
        isPDFPreviewModelRequired={isPDFPreviewModalOpen}
        setIsPDFPreviewModelRequired={setIsPDFPreviewModalOpen}
        plannerItems={plannerItems}
        setPlannerItems={setPlannerItems}
      ></PlannerList>
      {/* MODALS FOR THE SCREEN */}
      {currentClickedExcerciseTile && (
        <Modal
          title={"Excercise Detail"}
          pIsOpen={isModalOpen}
          setIsModelOpen={setIsModalOpen}
        >
          <ExcerciseDetail
            excercise={currentClickedExcerciseTile}
            isOpen={isModalOpen}
            setIsModelOpen={setIsModalOpen}
          />
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
          <AddExcercise />
        </Modal>
      )}
    </div>
  );
};
