import * as React from 'react';
import { useState } from "react";
import {
  ExcerciseType,
  iExcerciseDataDto,
  iExcerciseTile,
} from "../../../../models/ExcerciseInterface";
// import P_EmptyCard from "./EmptyCard";
import { Card, Flex, Text, Button, Skeleton } from "@radix-ui/themes";
// import { EditExcercise } from "./EditExcercise";
// import { ExcerciseDetail } from "./ExcerciseDetail";
import { useCurrentMainScreenContext } from "../../DoctorHomePage";
// import { deleteOriginalExcercise } from "../../../../controllers/ExcerciseController";
// import ErrorHandler from "../../../../errorHandlers/ErrorHandler";
// import { DefaultToastTiming, useToast } from "../../../../stores/ToastContext";
// import { ToastColors } from "../../../../components/Toast";
import { useNavigate, useParams } from "react-router-dom";
import ThemeColorPallate from "../../../../assets/ThemeColorPallate";
import { BiExpand } from "react-icons/bi";
// import { IoMdAdd } from "react-icons/io";

export const ExcerciseTile = ({ data }: { data: iExcerciseTile }) => {
  const [mouseShape, setMouseShape] = useState("pointer");
  // const { showToast } = useToast();
  // const { isExcerciseBuilderRefresh, setIsExcerciseBuilderRefresh } =
  //   useCurrentMainScreenContext();
  const navigate = useNavigate();
  const {pid} = useParams();
  const onDeleteButtonClick = (exerciseData: iExcerciseDataDto)=>{
    // navigate("doctorhome/main/patientDetails/a4cc96da-1977-486c-91c4-cf0dd561e884/buildPlan", {
    navigate("/doctorhome/main/patientDetails/" + pid + "/buildPlan/deleteExcercise", {
      state: { 
        // onActionButtonClick: deleteExcercise,
        actionButtonClickParams: exerciseData, 
        title: "Are you sure you want to delete ?", 
        message: "This excercise will be deleted permanently. Are you sure you want to go ahead?",
        actionButtonText: "Delete",
        closeButtonText: "Cancel"
      },
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  // const deleteExcercise = async (checking: iExcerciseDataDto, timepass:any) => {
  
  if (data.viewType == ExcerciseType.FULL_VIEW) {
    return (
      <ExcerciseTileFullView
        data={data}
        deleteExcercise={() => onDeleteButtonClick(data.excercise)}
        mouseShape={mouseShape}
        setMouseShape={setMouseShape}
      />
    );
  } else {
    return (
      <ExcerciseTileMobileView
        data={data}
        deleteExcercise={() => onDeleteButtonClick(data.excercise)}
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
  const [isLoading, setIsLoading] = useState(true);
  const handleImageLoad = () => {
    setIsLoading(false); // Update loading state
    console.log(
      "Image loaded successfully:",
      data.excercise.excercise_image_url
    );
  };
  const { pid } = useParams();
  const navigate = useNavigate();
  const { isExcerciseBuilderLoading } = useCurrentMainScreenContext();

  const handleImageError = () => {
    setIsLoading(false); // Update loading state
    // console.error("Failed to load image:", data.excercise.excercise_image_url);
  };

  const onExcerciseTileAdd = () => {
    data.onAdd(data.excercise);
  };

  const onExcerciseDetailsClick = () =>{
    navigate(
      "/doctorhome/main/patientDetails/" +pid +"/buildPlan/excerciseDetails/" +data.excercise.e_id,
      { state: { excercise: data.excercise } }
    );
  }
  const onExcerciseEditClick = () => {
    navigate(
      "/doctorhome/main/patientDetails/" +
        pid +
        "/buildPlan/editExcercise/" +
        data.excercise.e_id,
      { state: { excercise: data.excercise } }
    );
  };

  return (
    <Card
      size="5"
      style={{
        width: "300px",
        height: "400px",
        margin: "10px",
        padding: "10px",
      }}
      data-testid="exercise-tile"
    >
      <Flex direction="column" gap="3">
        {/* <Button
          variant="solid"
          size="4"
          style={{
            position: "absolute",
            bottom: "85%",
            right: "10%",
            zIndex: 2,
            borderRadius: "50%",
            width: "2.5rem",
            height: "2.5rem",
            boxShadow: "1px 2px 44px 5px rgba(0,0,0, 0.75)",
          }}
        > */}
        {/* <BiExpand
            className="text-1xl text-slate-700"
            style={{
              position: "absolute",
              bottom: "85%",
              backdropFilter: "blur(10px)",
              right: "10%",
              zIndex: 2,
              borderRadius: "50%",
              padding: "0.5rem",
              width: "2.5rem",
              height: "2.5rem",
              boxShadow: "1px 2px 44px 5px rgba(0,0,0, 0.75)",
              color: ThemeColorPallate.cardFontColorBlack
            }}
          /> */}
        {/* </Button> */}
        <Skeleton loading={isLoading || isExcerciseBuilderLoading}>
          <div style={{ width: "100%", height: "200px", position: "relative" }}>
            <img
              src={data.excercise.excercise_image_url}
              alt={data.excercise.excercise_name}
              role="img"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "10px",
                cursor: mouseShape,
              }}
              onLoad={handleImageLoad}
              onError={handleImageError}
              data-testid="exercise-image"
            />
          </div>
        </Skeleton>
        <Text
          size="6"
          weight="bold"
          style={{ cursor: mouseShape, textAlign: "center" }}
          onClick={data.onClick}
          onMouseEnter={() => setMouseShape("grab")}
          onMouseLeave={() => setMouseShape("pointer")}
        >
          {data.excercise.excercise_name}
        </Text>
        <Text
          size="4"
          style={{ cursor: mouseShape }}
          onClick={data.onClick}
          onMouseEnter={() => setMouseShape("grab")}
          onMouseLeave={() => setMouseShape("pointer")}
        >
          {data.excercise.excercise_type}
        </Text>
        <Flex gap="2" justify="center">
          <Button variant="soft" size="3" onClick={onExcerciseTileAdd}>
            Add
          </Button>
          <Button variant="soft" size="3" onClick={onExcerciseEditClick}>
            Edit
          </Button>
          {/* <EditExcercise
            excercise={data.excercise}
            e_id={data.excercise.e_id}
          ></EditExcercise> */}
          <BiExpand
            className="text-1xl text-slate-700"
            onClick={onExcerciseDetailsClick}
            style={{
              position: "absolute",
              bottom: "85%",
              backdropFilter: "blur(10px)",
              right: "10%",
              zIndex: 2,
              borderRadius: "50%",
              padding: "0.5rem",
              width: "2.5rem",
              height: "2.5rem",
              boxShadow: "1px 2px 44px 5px rgba(0,0,0, 0.75)",
              color: ThemeColorPallate.cardFontColorBlack,
            }}
            data-testid="expand-button"
          />
          {/* <ExcerciseDetail></ExcerciseDetail> */}
          {/* <Button
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
          </Button> */}
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
  const { isExcerciseBuilderLoading } = useCurrentMainScreenContext();

  const [isLoading, setIsLoading] = useState(true);
  const handleImageLoad = () => {
    setIsLoading(false); // Update loading state
    console.log(
      "Image loaded successfully:",
      data.excercise.excercise_image_url
    );
  };

  const handleImageError = () => {
    setIsLoading(false); // Update loading state
    console.error("Failed to load image:", data.excercise.excercise_image_url);
  };

  return (
    <Card
      size="2"
      style={{
        marginBottom: "10px",
        padding: "10px",
        width: "100%",
        height: "100px",
      }}
    >
      <Flex gap="3" align="center">
        <Skeleton loading={isLoading || isExcerciseBuilderLoading}>
          <div style={{ width: "80px", height: "80px", position: "relative" }}>
            <img
              src={data.excercise.excercise_image_url}
              alt={data.excercise.excercise_name}
              role="img"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                cursor: mouseShape,
              }}
              onLoad={handleImageLoad}
              onError={handleImageError}
              onClick={data.onClick}
              onMouseEnter={() => setMouseShape("grab")}
              onMouseLeave={() => setMouseShape("pointer")}
            />
          </div>
        </Skeleton>
        <Flex direction="column" gap="2" style={{ flex: 1 }}>
          <Text
            size="5"
            weight="bold"
            style={{ cursor: mouseShape }}
            onClick={data.onClick}
            onMouseEnter={() => setMouseShape("grab")}
            onMouseLeave={() => setMouseShape("pointer")}
          >
            {data.excercise.excercise_name}
          </Text>
          <Text
            size="4"
            style={{ cursor: mouseShape }}
            onClick={data.onClick}
            onMouseEnter={() => setMouseShape("grab")}
            onMouseLeave={() => setMouseShape("pointer")}
          >
            {data.excercise.excercise_type}
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
