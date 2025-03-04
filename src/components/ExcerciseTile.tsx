import { useState } from "react";
import { iExcerciseTile } from "../models/ExcerciseInterface";
import P_EmptyCard from "./EmptyCard";

export const ExcerciseTile = ( data: iExcerciseTile) => {
  const onExcerciseAddClick = data.onAdd;
  const [mouseShape, setMouseShape] = useState("pointer");
  return (
    <P_EmptyCard className="w-96">
      <div
        className= "flex-block items-start justify-center border-2 border-slate-500 rounded-md h-80 w-60 sm:w-200 bg-slate-700 mt-8 cursor-pointer"
      >
        <img 
         onClick={data.onClick}
         onMouseEnter={() => {setMouseShape("grab")}}
         onMouseLeave={() => {setMouseShape("pointer")}}
         style={{ cursor: mouseShape }} src={data.excercise.imgSrc} 
         className="h-48 w-full">
         </img>
        <p 
          onClick={data.onClick}
          onMouseEnter={() => {setMouseShape("grab")}}
          onMouseLeave={() => {setMouseShape("pointer")}}
          style={{ cursor: mouseShape }} 
          className="flex justify-center text-gray-200">{data.excercise.name}</p>
        {/* <p className="flex justify-start text-gray-200">
          {data.description.Cues.points[0]}
        </p> */}
        <p 
          onClick={data.onClick}
          onMouseEnter={() => {setMouseShape("grab")}}
          onMouseLeave={() => {setMouseShape("pointer")}}
          style={{ cursor: mouseShape }}
          className="flex pl-4 justify-start text-gray-200">{data.excercise.type}</p>
        <div className="grid grid-cols-3 justify-center text-gray-200">
          <button onClick={() => onExcerciseAddClick(data.excercise)} className="bg-slate-500 rounded-md p-2 m-2">Add</button>
          <button className="bg-slate-500 rounded-md p-2 m-2">Edit</button>
          <button className="bg-slate-500 rounded-md p-2 m-2">Delete</button>
        </div>
      </div>
    </P_EmptyCard>
  );
};
