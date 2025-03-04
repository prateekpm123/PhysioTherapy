import { iExcerciseData } from "../models/ExcerciseInterface";
import {  H5, H6, H8 } from "./TextTags";

export const PDFExcerciseView1 = (excercise: iExcerciseData) => {
  return (
    <div className="grid grid-cols-12 border-t-2 border-l-2 border-r-2 p-2 border-slate-900 w-full h-full pb-4">
    {/* // <div className="grid grid-cols-12 divide-x-2 divide-y-2 divide-gray-900 w-full h-full pb-4"> */}
      <div className="col-span-4 h-1/4">
        <H5 className="text-slate-900 ">{excercise.name}</H5>
        <img
          src={excercise.imgSrc}
          alt={excercise.name}
          className="h-fit w-fit mt-4"
        />
      </div>
      <div className="col-span-2 h-1/4 p-4">
        <H6 className="text-slate-900">Sets</H6>
        <H8 className="text-slate-800">{excercise.description.sets} {"( "}{" "}
        {excercise.description.setsDescription} {" )"}</H8>
        <br></br>
        <H6 className="text-slate-900">Repetitions</H6>
        <H8 className="text-slate-800">{excercise.description.repititions} {"( "}
        {excercise.description.repititionsDescription} {" )"}</H8>
      </div>
      <div className="col-span-6 h-1/4 p-2">
        <h1 className="text-slate-900 text-5xl list-disc list-inside mb-4">Steps  </h1>
        {excercise.description.Cues.Points.map(
          (point: string, index: number) => (
            <li className="text-slate-800 text-3xl list-item" key={index}>
              {point}
            </li>
          )
        )}
      </div>
    </div>
  );
};
