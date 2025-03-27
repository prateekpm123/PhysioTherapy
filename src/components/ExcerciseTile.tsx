import { useState } from "react";
import {
  ExcerciseType,
  iExcerciseDataDto,
  iExcerciseTile,
} from "../models/ExcerciseInterface";
// import P_EmptyCard from "./EmptyCard";
import { Card, Flex, Text, Button, Skeleton } from "@radix-ui/themes";
import { EditExcercise } from "./EditExcercise";
import { ExcerciseDetail } from "./ExcerciseDetail";
import { useCurrentMainScreenContext } from "../pages/DoctorHomePage/DoctorHomePage";
import { deleteOriginalExcercise } from "../controllers/ExcerciseController";
import ErrorHandler from "../errorHandlers/ErrorHandler";
import { DefaultToastTiming, useToast } from "../stores/ToastContext";
import { ToastColors } from "./Toast";
// import { IoMdAdd } from "react-icons/io";

export const ExcerciseTile = (data: iExcerciseTile) => {
  const [mouseShape, setMouseShape] = useState("pointer");
  const {showToast} = useToast();
  const {isExcerciseBuilderRefresh, setIsExcerciseBuilderRefresh} = useCurrentMainScreenContext();

  const deleteExcercise = async (excercise: iExcerciseDataDto) => {
    try {
      deleteOriginalExcercise({
        data: {
          e_id: excercise.e_id
        },
        afterAPISuccess: (res) => {
          showToast("Excercise deleted successfully", DefaultToastTiming, ToastColors.GREEN);
          setIsExcerciseBuilderRefresh(!isExcerciseBuilderRefresh);
          console.log("Excercise deleted successfully:", res);
        },
        afterAPIFail: (res) => {
          ErrorHandler(res);
          console.error("Excercise delete failed:", res);
        },
      });
    } catch (error) {
      console.error("Error deleting node:", error);
    }
  };
  if (data.viewType == ExcerciseType.FULL_VIEW) {
    return (
      <ExcerciseTileFullView
        data={data}
        deleteExcercise={() => deleteExcercise(data.excercise)}
        mouseShape={mouseShape}
        setMouseShape={setMouseShape}
      />
    );
  } else {
    return (
      <ExcerciseTileMobileView
        data={data}
        deleteExcercise={() => deleteExcercise(data.excercise)}
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

  const { isExcerciseBuilderLoading } = useCurrentMainScreenContext();

  const handleImageError = () => {
    setIsLoading(false); // Update loading state
    // console.error("Failed to load image:", data.excercise.excercise_image_url);
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
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "10px",
                cursor: mouseShape,
              }}
              onLoad={handleImageLoad}
              onError={handleImageError}
              // onClick={data.onClick}
              // onMouseEnter={() => setMouseShape("grab")}
              // onMouseLeave={() => setMouseShape("pointer")}
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
          <Button
            variant="soft"
            size="3"
            onClick={() => data.onAdd(data.excercise)}
          >
            Add
          </Button>
          <EditExcercise
            excercise={data.excercise}
            e_id={data.excercise.e_id}
          ></EditExcercise>
          <ExcerciseDetail excercise={data.excercise}></ExcerciseDetail>
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
