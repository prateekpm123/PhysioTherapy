import { useState } from "react";
import { ExcerciseType, iExcerciseTile } from "../models/ExcerciseInterface";
// import P_EmptyCard from "./EmptyCard";
import { database } from "../databaseConnections/FireBaseConnection";
import { ref, remove } from "firebase/database";

export const ExcerciseTile = (data: iExcerciseTile) => {
  const [mouseShape, setMouseShape] = useState("pointer");

  const deleteExcercise = async (nodePath: string) => {
    try {
      const nodeRef = ref(database, "excercises/" + nodePath);
      remove(nodeRef)
        .then(() => {
          console.log("Node deleted successfully!");
          data.refreshExcercise();
        })
        .catch((error) => {
          console.error("Error deleting node:", error);
        });
    } catch (error) {
      console.error("Error deleting node:", error);
    }
  };
  if (data.viewType == ExcerciseType.FULL_VIEW) {
    return (
      <ExcerciseTileFullView
        data={data}
        deleteExcercise={deleteExcercise}
        mouseShape={mouseShape}
        setMouseShape={setMouseShape}
      />
    );
  } else {
    return (
      <ExcerciseTileMobileView
        data={data}
        deleteExcercise={deleteExcercise}
        mouseShape={mouseShape}
        setMouseShape={setMouseShape}
      />
    );
  }
};

interface ExcerciseTileViewProps {
  data: iExcerciseTile;
  deleteExcercise: (nodePath: string) => void;
  mouseShape: string;
  setMouseShape: (shape: string) => void;
}

const ExcerciseTileFullView = ({
  data,
  deleteExcercise,
  mouseShape,
  setMouseShape,
}: ExcerciseTileViewProps) => {
  return (
    // <P_EmptyCard className="w-96 p-0 m-0">
      <div className="flex-block items-start justify-center border-2 border-slate-500 rounded-md h-80 w-60 sm:w-200 bg-slate-700 mt-8 cursor-pointer">
        <img
          onClick={data.onClick}
          onMouseEnter={() => {
            setMouseShape("grab");
          }}
          onMouseLeave={() => {
            setMouseShape("pointer");
          }}
          style={{ cursor: mouseShape }}
          src={data.excercise.imgSrc}
          className="h-48 w-full"
        ></img>
        <p
          onClick={data.onClick}
          onMouseEnter={() => {
            setMouseShape("grab");
          }}
          onMouseLeave={() => {
            setMouseShape("pointer");
          }}
          style={{ cursor: mouseShape }}
          className="flex justify-center text-gray-200"
        >
          {data.excercise.name}
        </p>
        {/* <p className="flex justify-start text-gray-200">
          {data.description.Cues.points[0]}
        </p> */}
        <p
          onClick={data.onClick}
          onMouseEnter={() => {
            setMouseShape("grab");
          }}
          onMouseLeave={() => {
            setMouseShape("pointer");
          }}
          style={{ cursor: mouseShape }}
          className="flex pl-4 justify-start text-gray-200"
        >
          {data.excercise.type}
        </p>
        <div className="grid grid-cols-3 justify-center text-gray-200">
          <button
            onClick={() => data.onAdd(data.excercise)}
            className="bg-slate-500 rounded-md p-2 m-2"
          >
            Add
          </button>
          <button
            className="bg-slate-500 rounded-md p-2 m-2"
            onClick={() => {
              if (data.onExcerciseTileClick) {
                data.onExcerciseTileClick(data.excercise, data.excerciseKey);
              }
              data.onEdit();
            }}
          >
            Edit
          </button>
          <button
            className="bg-slate-500 rounded-md p-2 m-2"
            onClick={() => deleteExcercise(data.excerciseKey)}
          >
            Delete
          </button>
        </div>
      </div>
    // </P_EmptyCard>
  );
};

const ExcerciseTileMobileView = ({
  data,
  deleteExcercise,
  mouseShape,
  setMouseShape,
}: ExcerciseTileViewProps) => {
  return (
    // <P_EmptyCard className="h-12 p-0 w-full">
      <div className="grid grid-cols-12 cursor-pointer mb-3 bg-slate-700">
        <img
          onClick={data.onClick}
          onMouseEnter={() => {
            setMouseShape("grab");
          }}
          onMouseLeave={() => {
            setMouseShape("pointer");
          }}
          style={{ cursor: mouseShape }}
          src={data.excercise.imgSrc}
          className="h-full w-full col-span-3"
        ></img>
        <div className="col-span-9">
          <div className="grid grid-rows-3">
            <p
              onClick={data.onClick}
              onMouseEnter={() => {
                setMouseShape("grab");
              }}
              onMouseLeave={() => {
                setMouseShape("pointer");
              }}
              style={{ cursor: mouseShape }}
              className="row-span-1 text-gray-200"
            >
              {data.excercise.name}
            </p>
            <p
              onClick={data.onClick}
              onMouseEnter={() => {
                setMouseShape("grab");
              }}
              onMouseLeave={() => {
                setMouseShape("pointer");
              }}
              style={{ cursor: mouseShape }}
              className="row-span-1 text-gray-200"
            >
              {data.excercise.type}
            </p>
            <div className="grid grid-cols-3">
              <button
                onClick={() => data.onAdd(data.excercise)}
                className="col-span-1 bg-slate-500 rounded-md p-2 m-2"
              >
                Add
              </button>
              <button
                className="col-span-1 bg-slate-500 rounded-md p-2 m-2"
                onClick={() => {
                  if (data.onExcerciseTileClick) {
                    data.onExcerciseTileClick(
                      data.excercise,
                      data.excerciseKey
                    );
                  }
                  data.onEdit();
                }}
              >
                Edit
              </button>
              <button
                className="col-span-1 bg-slate-500 rounded-md p-2 m-2"
                onClick={() => deleteExcercise(data.excerciseKey)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    // </P_EmptyCard>
  );
};
