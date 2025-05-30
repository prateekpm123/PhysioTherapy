import { RiDeleteBinLine } from "react-icons/ri";
import { IPlannerItem } from "../../../../models/IPlannerItems";
import { useState } from "react";
import { Flex, Text } from "@radix-ui/themes";
import ThemeColorPallate from "../../../../assets/ThemeColorPallate";
import React from "react";

// import DraggableDiv from "./DraggableDiv";

export const PlannerItem = ({ excercise, onDelete }: IPlannerItem) => {
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
  const componentStyle = {
    margin: "8px 0px", // m-2
    backgroundColor: ThemeColorPallate.cardBackGroundColorBlack,
    padding: "12px", // p-3
    borderRadius: "6px", // rounded-md
    border: "2px solid rgb(51, 65, 85)", // border-2 border-slate-700
    display: "grid",
    gridTemplateColumns: "4fr 1fr",
  };

  return (
    <Flex
      direction="row"
      justify="start"
      align="stretch"
      width="100%"
      // height="48px" // h-12
      style={componentStyle}
    >
      <Text data-testid="excercise-name" color="gray" style={{ color: ThemeColorPallate.cardFontColorBlack }}>
        {excercise.excercise_name}
      </Text>
      <Flex justify="end" align="center">
        <Flex
          justify="end"
          align="start"
          // width="28px" // w-7
          // height="28px" // h-7
          style={{ backgroundColor: deleteBtnBgColor }}
        >
          <RiDeleteBinLine
            data-testid="delete-button"
            color={ThemeColorPallate.cardFontColorBlack}
            size={20}
            onPointerEnter={onPointerEnterInDelete}
            onPointerLeave={onPointerLeaveInDelete}
            onClick={() => onDelete(excercise)}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
