import { Suspense, useRef } from "react";
import { iExcerciseData } from "../models/ExcerciseInterface";
import { PlannerItem } from "./PlannerItem";

export interface PlannerListProps {
  plannerItems: iExcerciseData[];
  setPlannerItems?: React.Dispatch<React.SetStateAction<iExcerciseData[]>>;
  isPDFPreviewModelRequired: boolean;
  setIsPDFPreviewModelRequired: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PlannerList = (inputs: PlannerListProps) => {
  const plannerListRef = useRef<HTMLDivElement>(null);

  const onDelete = (excercise: iExcerciseData) => {
    const index = inputs.plannerItems.findIndex(
      (item) => item.name === excercise.name
    );
    inputs.plannerItems.splice(index, 1);
    if (inputs.setPlannerItems) {
      inputs.setPlannerItems([...inputs.plannerItems]);
    }
  };
  
  const previewPDF = () => {
    inputs.setIsPDFPreviewModelRequired(true);
  }

  return (
    <div
      ref={plannerListRef}
      className="flex flex-col items-center justify-start w-full h-full z-10 bg-slate-600"
    >
      <h1 className="text-2xl text-slate-100">Patient Plan</h1>
      <div
        style={{ height: "95%" }}
        className="w-full max-h-dvh overflow-y-scroll"
      >
        <Suspense fallback={<div>Loading...</div>}></Suspense>
        <Suspense>
          {inputs.plannerItems.map((_, i) => (
            <PlannerItem
              excercise={inputs.plannerItems[i]}
              plannerListRef={plannerListRef}
              onDelete={onDelete}
            ></PlannerItem>
          ))}
        </Suspense>
      </div>
      <button
        className="bg-slate-800 p-2 rounded-md w-full m-1 justify-end text-slate-100"
        onClick={previewPDF}
      >
        Preview PDF
      </button>
    </div>
  );
};
