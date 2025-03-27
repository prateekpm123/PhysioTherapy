import {
  // Button,
  // Dialog,
  Flex,
  Heading,
  ScrollArea,
  Text,
} from "@radix-ui/themes";
import { useLocation, useNavigate } from "react-router-dom";
import { iExcerciseData } from "../../../../models/ExcerciseInterface";
import Modal from "./TestModal";
// import { iExcerciseData } from "../../../../models/ExcerciseInterface";
// import ThemeColorPallate from "../../../../assets/ThemeColorPallate";
// import { BiExpand } from "react-icons/bi";

// export interface iExcerciseDetailProps {
//   excercise: iExcerciseData;
// }

export const ExcerciseDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const excerciseDetailProp = location.state.excercise as iExcerciseData;
  return (
    <Modal title="Excercise Detail" onActionButtonClick={() => navigate(-1)}  actionButtonText="Ok">
    <ScrollArea style={{ height: "40rem" }}>
      <Flex
        direction="row"
        height="100%"
        width="100%"
        gap="6"
        align="start"
        justify="start"
      >
        {/* <Flex direction="row" justify="between" minWidth="300px"> */}
        <img
          src={excerciseDetailProp.excercise_image_url}
          alt={excerciseDetailProp.excercise_name}
          style={{ width: "50%", maxWidth: "25rem" }}
        />
        {/* </Flex> */}

        <Flex direction="column" gap="4" minWidth="20rem">
          <Heading size="4">Description</Heading>
          {/* <Heading size="5">
              {excerciseDetailProp.excercise_description}
            </Heading> */}

          <ul style={{ listStyleType: "disc", marginLeft: "20px" }}>
            {excerciseDetailProp.excercise_description
              .split("\n")
              .map((point: string, index: number) => (
                <li key={index}>{point}</li>
              ))}
          </ul>
        </Flex>
        <Flex direction="column" style={{ minWidth: "20rem" }}>
          <Text weight="bold">Set and Repetition</Text>
          <Text color="gray">
            {excerciseDetailProp.excercise_sets} {" - "}
            {excerciseDetailProp.excercise_sets_description}
          </Text>
          <Text color="gray">
            {excerciseDetailProp.excercise_reps} {" - "}
            {excerciseDetailProp.excercise_reps_description}
          </Text>
        </Flex>
      </Flex>
    </ScrollArea>
    </Modal>
  );
};
