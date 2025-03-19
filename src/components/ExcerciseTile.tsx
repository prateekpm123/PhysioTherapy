import { useState } from "react";
import { ExcerciseType, iExcerciseTile } from "../models/ExcerciseInterface";
// import P_EmptyCard from "./EmptyCard";
import { database } from "../databaseConnections/FireBaseConnection";
import { ref, remove } from "firebase/database";
import React from "react"
import {
  Card,
  Flex,
  Text,
  Button,
} from "@radix-ui/themes";


export const ExcerciseTile = (data: iExcerciseTile) => {
  const [mouseShape, setMouseShape] = useState("pointer");

  const deleteExcercise = async (nodePath: string) => {
    try {
      console.log("Inside delete function \n Deleting node:", nodePath);
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
    <Card size="5" style={{ width: "300px", height:"400px", margin: "10px", padding: "10px" }}>
      <Flex direction="column" gap="3">
        <img
          src={data.excercise.imgSrc}
          alt={data.excercise.name}
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            borderRadius: "10px",
            cursor: mouseShape,
          }}
          onClick={data.onClick}
          onMouseEnter={() => setMouseShape("grab")}
          onMouseLeave={() => setMouseShape("pointer")}
        />
        <Text
          size="6"
          weight="bold"
          style={{ cursor: mouseShape, textAlign: "center" }}
          onClick={data.onClick}
          onMouseEnter={() => setMouseShape("grab")}
          onMouseLeave={() => setMouseShape("pointer")}
        >
          {data.excercise.name}
        </Text>
        <Text
          size="4"
          style={{ cursor: mouseShape }}
          onClick={data.onClick}
          onMouseEnter={() => setMouseShape("grab")}
          onMouseLeave={() => setMouseShape("pointer")}
        >
          {data.excercise.type}
        </Text>
        <Flex gap="2" justify="center">
          <Button
            variant="soft"
            size="3"
            onClick={() => data.onAdd(data.excercise)}
          >
            Add
          </Button>
          <Button
            variant="soft"
            size="3"
            onClick={() => {
              if (data.onExcerciseTileClick) {
                data.onExcerciseTileClick(data.excercise, data.excerciseKey);
              }
              data.onEdit();
            }}
          >
            Edit
          </Button>
          <Button
            size="3"
            variant="soft"
            onClick={() => deleteExcercise(data.excerciseKey)}
          >
            Delete
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
};

const ExcerciseTileMobileView = ({
  data,
  deleteExcercise,
  mouseShape,
  setMouseShape,
}: ExcerciseTileViewProps) => {
  return (
    <Card size="2" style={{ marginBottom: "10px", padding: "10px", width: "100%", height: "100px" }}>
      <Flex gap="3" align="center">
        <img
          src={data.excercise.imgSrc}
          alt={data.excercise.name}
          style={{
            width: "80px",
            height: "80px",
            objectFit: "cover",
            cursor: mouseShape,
          }}
          onClick={data.onClick}
          onMouseEnter={() => setMouseShape("grab")}
          onMouseLeave={() => setMouseShape("pointer")}
        />
        <Flex direction="column" gap="2" style={{ flex: 1 }}>
          <Text
            size="5"
            weight="bold"
            style={{ cursor: mouseShape }}
            onClick={data.onClick}
            onMouseEnter={() => setMouseShape("grab")}
            onMouseLeave={() => setMouseShape("pointer")}
          >
            {data.excercise.name}
          </Text>
          <Text
            size="4"
            style={{ cursor: mouseShape }}
            onClick={data.onClick}
            onMouseEnter={() => setMouseShape("grab")}
            onMouseLeave={() => setMouseShape("pointer")}
          >
            {data.excercise.type}
          </Text>
          <Flex gap="2" justify="start">
            <Button
              variant="soft"
              size="2"
              onClick={() => data.onAdd(data.excercise)}
            >
              Add
            </Button>
            <Button
              variant="soft"
              size="2"
              onClick={() => {
                if (data.onExcerciseTileClick) {
                  data.onExcerciseTileClick(data.excercise, data.excerciseKey);
                }
                data.onEdit();
              }}
            >
              Edit
            </Button>
            <Button
              variant="soft"
              size="2"
              onClick={() => deleteExcercise(data.excerciseKey)}
            >
              Delete
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};