import {
  Button,
  Dialog,
  Flex,
  Heading,
  ScrollArea,
  Text,
} from "@radix-ui/themes";
import { iExcerciseData } from "../../../../models/ExcerciseInterface";
import ThemeColorPallate from "../../../../assets/ThemeColorPallate";
import { BiExpand } from "react-icons/bi";

export interface iExcerciseDetailProps {
  excercise: iExcerciseData;
}

export const ExcerciseDetail = (excerciseDetailProp: iExcerciseDetailProps) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <BiExpand
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
            color: ThemeColorPallate.cardFontColorBlack,
          }}
        />
      </Dialog.Trigger>
          
      <Dialog.Content minHeight="20rem" minWidth="80rem" width="100%">
        <Dialog.Title>
          {excerciseDetailProp.excercise?.excercise_name}
        </Dialog.Title>
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
              src={excerciseDetailProp.excercise.excercise_image_url}
              alt={excerciseDetailProp.excercise.excercise_name}
              style={{ width: "50%", maxWidth: "25rem" }}
            />
            {/* </Flex> */}

            <Flex direction="column" gap="4" minWidth="20rem">
              <Heading size="4">Description</Heading>
              {/* <Heading size="5">
              {excerciseDetailProp.excercise.excercise_description}
            </Heading> */}

              <ul style={{ listStyleType: "disc", marginLeft: "20px" }}>
                {excerciseDetailProp.excercise.excercise_description
                  .split("\n")
                  .map((point: string, index: number) => (
                    <li key={index}>{point}</li>
                  ))}
              </ul>
            </Flex>
            <Flex direction="column" style={{ minWidth: "20rem" }}>
              <Text weight="bold">Set and Repetition</Text>
              <Text color="gray">
                {excerciseDetailProp.excercise.excercise_sets} {" - "}
                {excerciseDetailProp.excercise.excercise_sets_description}
              </Text>
              <Text color="gray">
                {excerciseDetailProp.excercise.excercise_reps} {" - "}
                {excerciseDetailProp.excercise.excercise_reps_description}
              </Text>
            </Flex>
          </Flex>
        </ScrollArea>
        <Flex
          gap="3"
          mt="4"
          justify="end"
          style={{ position: "absolute", bottom: "1rem", right: "1rem" }}
        >
          <Dialog.Close>
            <Button variant="solid" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button>Edit Excercise</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};
