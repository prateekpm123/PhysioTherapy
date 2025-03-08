import { RiDeleteBinLine } from "react-icons/ri";
import { IPlannerItem } from "../models/IPlannerItems";
import { useState } from "react";
import React from "react";

// import DraggableDiv from "./DraggableDiv";

export const PlannerItem = (plannerData: IPlannerItem) => {
  const deleteBtnDivCSSFixedPart =
    "flex flex- items-center justify-center w-7 h-7 ";
  const [deleteBtnBgColor, setDeleteBtnBgColor] = useState(
    deleteBtnDivCSSFixedPart + "bg-slate-800"
  );
  const onPointerEnterInDelete = () => {
    setDeleteBtnBgColor(deleteBtnDivCSSFixedPart + "bg-slate-950");
  };

  const onPointerLeaveInDelete = () => {
    setDeleteBtnBgColor(deleteBtnDivCSSFixedPart + "bg-slate-800");
  };
  return (
    <div className="grid grid-cols-5 w-full h-12 bg-slate-800 p-3 rounded-md justify-center items-start border-2 border-slate-700">
      {/* <DraggableDiv parentRef={plannerData.plannerListRef}> */}
        <p className="col-span-4 text-slate-100">
          {plannerData.excercise.name}
        </p>
        <div className="col-span-1">
          <div className={deleteBtnBgColor}>
            <RiDeleteBinLine
              className=""
              color="white" 
              size={20}
              onPointerEnter={onPointerEnterInDelete}
              onPointerLeave={onPointerLeaveInDelete}
              onClick={() => plannerData.onDelete(plannerData.excercise)}
            />
          </div>
        </div>
      {/* </DraggableDiv> */}
    </div>
  );
};
