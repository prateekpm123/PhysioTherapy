import { Button, Dialog, Flex, Heading, Text } from "@radix-ui/themes";
import { iExcerciseData } from "../models/ExcerciseInterface";
import React from "react";

export interface iExcerciseDetailProps {
  excercise: iExcerciseData;
}

export const ExcerciseDetail = (excerciseDetailProp: iExcerciseDetailProps) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="soft" size="3">
          Details
        </Button>
      </Dialog.Trigger>

      <Dialog.Content minHeight="20rem" minWidth="80rem" width="100%">
        <Dialog.Title>
          {excerciseDetailProp.excercise?.excercise_name}
        </Dialog.Title>
        <Flex direction="row" height="100%" width="100%" gap="6" align="baseline" justify="start">
          <Flex direction="row" justify="between" minWidth="300px">
            <img
              src={excerciseDetailProp.excercise.excercise_image_url}
              alt={excerciseDetailProp.excercise.excercise_name}
              style={{ height: "50%", width: "50%" }}
            />
          </Flex>
          <Flex direction="column" gap="4">
            <Heading size="4" >
              Description
            </Heading>
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
          <Flex direction="column">
            <Text weight="bold">
              Set and Repetition
            </Text>
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
        <Flex gap="3" mt="4" justify="end" style={{position: "absolute", bottom: "1rem", right: "1rem"}}>
          <Dialog.Close>
            <Button variant="soft" color="gray">
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
