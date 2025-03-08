import { iExcerciseData } from "../models/ExcerciseInterface";
import React from "react";

export interface iExcerciseDetailProps {
    excercise: iExcerciseData;
    isOpen: boolean;
    setIsModelOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ExcerciseDetail = (excerciseDetailProp: iExcerciseDetailProps) => {
  // console.log(excerciseDetailProp);

  return (
      <div className="h-full w-full">
        <div className="excercise-detail__header">
          <div className="excercise-detail__header__left">
            <img src={excerciseDetailProp.excercise.imgSrc} alt={excerciseDetailProp.excercise.name} className="h-1/2 w-1/2"/>
            <h3 className="text-3xl text-slate-100">{excerciseDetailProp.excercise.name}</h3>
          </div>
        </div>
        <div className="excercise-detail__description">
          <h4 className="text-2xl text-slate-100">Description</h4>
          <p className="text-slate-100 text-xl font-bold">Set and Repetition</p>
          <p className="text-slate-100 text-lg">
            {excerciseDetailProp.excercise.description.sets} {" - "} {excerciseDetailProp.excercise.description.setsDescription}
          </p>
          <p className="text-slate-100 text-lg">
            {excerciseDetailProp.excercise.description.repititions} {" - "}
            {excerciseDetailProp.excercise.description.repititionsDescription}
          </p>
          <ul className="list-disc list-inside">
            {excerciseDetailProp.excercise.description.Cues.Points.map(
              (point: string, index: number) => (
                <li className="text-slate-100" key={index}>{point}</li>
              )
            )}
          </ul>
        </div>
      </div>
  );
};
