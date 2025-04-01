import React, { useRef, useState } from "react";
import {
  Flex,
  Heading,
  TextField,
  Button,
  Skeleton,
  Text,
  TextArea,
  ScrollArea,
  // CheckboxGroup,
} from "@radix-ui/themes";
import { iExcerciseDataDto } from "../../../models/ExcerciseInterface";
import { saveExcercisePlan } from "../../../controllers/ExcerciseController";
import {
  DoctorHomeMainScreen,
  useCurrentMainScreenContext,
} from "../DoctorHomePage";
// import ErrorHandler from "../../../errorHandlers/ErrorHandler";
import { DefaultToastTiming, useToast } from "../../../stores/ToastContext";
import { ToastColors } from "../../../components/Toast";
import { useNavigate, useParams } from "react-router-dom";
import ThemeColorPallate from "../../../assets/ThemeColorPallate";
import NumberComponent from "../../../components/NumberComonent";

// interface CreateExcercisePlanPageProps {
//   exercises: iExcerciseDataDto[];
// }

const CreateExcercisePlanPage = () => {
  const {
    currentPatientDetails,
    excerciseBuilderPlannerList,
    setCurrentMainScreen,
    setExcerciseBuilderPlannerList,
    breadCrumbItems,
    setBreadCrumbItems,
  } = useCurrentMainScreenContext();

  const { showToast } = useToast();
  const navigate = useNavigate();
  const { pid } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const [Monday, setMonday] = useState(false);
  const [Tuesday, setTuesday] = useState(false);
  const [Wednesday, setWednesday] = useState(false);
  const [Thursday, setThursday] = useState(false);
  const [Friday, setFriday] = useState(false);
  const [Saturday, setSaturday] = useState(false);
  const [Sunday, setSunday] = useState(false);
  // const today = new Date();
  // const [startDate, setStartDate] = useState<Date>(today);
  // const [endDate, setEndDate] = useState<Date>(today);
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const [selectedDays, setWeekSelection] = useState(["1"]);
  // const selectedDays = new Set();
  // const weekSelect
  // const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    field: keyof iExcerciseDataDto
  ) => {
    const updatedExercises = [...excerciseBuilderPlannerList];
    if (field === "excercise_reps" || field === "excercise_sets") {
      updatedExercises[index][field] = parseInt(e.target.value, 10);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updatedExercises[index][field] = e.target.value as any;
    }
    setExcerciseBuilderPlannerList(updatedExercises);
  };

  const getAllData = () => {
    const selectedDays = [
      Monday,
      Tuesday,
      Wednesday,
      Thursday,
      Friday,
      Saturday,
      Sunday,
    ];
    const selectedDaysValue = [] as string[];
    for (let i = 1; i <= selectedDays.length; i++) {
      if (selectedDays[i - 1]) {
        selectedDaysValue.push(i.toString());
      }
    }
    const data = {
      excercises: excerciseBuilderPlannerList,
      startDate: startRef.current?.value,
      endDate: endRef.current?.value,
      selectedDays: selectedDaysValue.join(","),
      patientId: pid,
    };
    return data;
  };

  const onExcercisePlanSave = () => {
    const data = getAllData();
    setIsLoading(true);
    saveExcercisePlan({
      data: data,
      afterAPISuccess: (response) => {
        setIsLoading(false);
        showToast(
          "Excercise Plan created successfully",
          DefaultToastTiming,
          ToastColors.GREEN
        );
        breadCrumbItems.pop();
        breadCrumbItems.pop();
        setBreadCrumbItems(breadCrumbItems);
        setExcerciseBuilderPlannerList([]);
        navigate(
          "/doctorhome/main/patientDetails/" + currentPatientDetails?.p_id
        );
        setCurrentMainScreen(DoctorHomeMainScreen.PATIENT_DETAILS);
        console.log(response);
      },
      afterAPIFail: (response) => {
        setIsLoading(false);
        showToast(response.message, DefaultToastTiming, ToastColors.RED);
        // ErrorHandler(response);
        // console.log(response);
      },
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCheckboxChange = (event: any) => {
    if (event.target.value == "1") {
      setMonday(event.target.checked);
    } else if (event.target.value == "2") {
      setTuesday(event.target.checked);
    } else if (event.target.value == "3") {
      setWednesday(event.target.checked);
    } else if (event.target.value == "4") {
      setThursday(event.target.checked);
    } else if (event.target.value == "5") {
      setFriday(event.target.checked);
    } else if (event.target.value == "6") {
      setSaturday(event.target.checked);
    } else if (event.target.value == "7") {
      setSunday(event.target.checked);
    }
    // if(event.target.checked) {
    //   selectedDays.add(event.target.value);
    // } else {
    //   if(selectedDays.has(event.target.value)) {
    //     selectedDays.delete(event.target.value);
    //   }
    // }
    // setWeekSelection(values);
    // selectedDays.current = values;
    // console.log("Selected Values:", selectedDays.current);
    // You can use selectedValuesRef.current here or in other parts of your component
  };

  return (
    <Flex direction="column" gap="4" pl="4" pt="4">
      <Flex direction="row" gap="4">
        {/* Can you create a start and end date field
          Also can you add a week multi select radio button
        */}
        {/* Start and End Date fields */}
        {/* Start and End date fields */}
        <div>
          <Text size="4" weight="bold">
            Start Date:
          </Text>
          <input ref={startRef} type="date" />
        </div>
        <div>
          <Text size="4" weight="bold">
            End Date:
          </Text>
          <input ref={endRef} type="date" />
        </div>
        {/* Week multi-select radio button (using CheckboxGroup) */}
        <Flex direction="row" gap="2">
          <Text size="4" weight="bold">
            Select Days
          </Text>
          {/* Start and End date fields */}
          {/* Week multi-select radio buttons */}
          <div>
            <label>
              <input
                type="checkbox"
                checked={Monday}
                value="1"
                onChange={handleCheckboxChange}
              />{" "}
              Monday
            </label>
            <label>
              <input
                type="checkbox"
                checked={Tuesday}
                value="2"
                onChange={handleCheckboxChange}
              />{" "}
              Tuesday
            </label>
            <label>
              <input
                type="checkbox"
                checked={Wednesday}
                value="3"
                onChange={handleCheckboxChange}
              />{" "}
              Wednesday
            </label>
            <label>
              <input
                type="checkbox"
                checked={Thursday}
                value="4"
                onChange={handleCheckboxChange}
              />{" "}
              Thursday
            </label>
            <label>
              <input
                type="checkbox"
                checked={Friday}
                value="5"
                onChange={handleCheckboxChange}
              />{" "}
              Friday
            </label>
            <label>
              <input
                type="checkbox"
                checked={Saturday}
                value="6"
                onChange={handleCheckboxChange}
              />{" "}
              Saturday
            </label>
            <label>
              <input
                type="checkbox"
                checked={Sunday}
                value="7"
                onChange={handleCheckboxChange}
              />{" "}
              Sunday
            </label>
          </div>
          {/* <CheckboxGroup.Root
            style={{ display: "inline-block" }}
            defaultValue={["1"]}
            name="example"
            onChange={handleCheckboxChange}
          >
            <CheckboxGroup.Item
              style={{
                display: "inline-flex",
                alignItems: "center",
                marginRight: "10px",
              }}
              value="1"
              onChange={handleCheckboxChange}
            >
              Monday
            </CheckboxGroup.Item>
            <CheckboxGroup.Item
              style={{
                display: "inline-flex",
                alignItems: "center",
                marginRight: "10px",
              }}
              value="2"
              onChange={handleCheckboxChange}
            >
              Tuesday
            </CheckboxGroup.Item>
            <CheckboxGroup.Item
              style={{
                display: "inline-flex",
                alignItems: "center",
                marginRight: "10px",
              }}
              value="3"
              onChange={handleCheckboxChange}
            >
              Wednesday
            </CheckboxGroup.Item>
            <CheckboxGroup.Item
              style={{
                display: "inline-flex",
                alignItems: "center",
                marginRight: "10px",
              }}
              value="4"
              onChange={handleCheckboxChange}
            >
              Thursday
            </CheckboxGroup.Item>
            <CheckboxGroup.Item
              style={{
                display: "inline-flex",
                alignItems: "center",
                marginRight: "10px",
              }}
              value="5"
              onChange={handleCheckboxChange}
            >
              Friday
            </CheckboxGroup.Item>
            <CheckboxGroup.Item
              style={{
                display: "inline-flex",
                alignItems: "center",
                marginRight: "10px",
              }}
              value="6"
              onChange={handleCheckboxChange}
            >
              Saturday
            </CheckboxGroup.Item>
            <CheckboxGroup.Item
              style={{
                display: "inline-flex",
                alignItems: "center",
                marginRight: "10px",
              }}
              value="7"
              onChange={handleCheckboxChange}
            >
              Sunday
            </CheckboxGroup.Item>
          </CheckboxGroup.Root> */}
        </Flex>
      </Flex>
      <ScrollArea style={{ height: "50rem" }}>
        <Flex direction="column" gap="4">
          {excerciseBuilderPlannerList.map((exercise, index) => (
            <Flex
              direction="column"
              gap="2"
              mb="4"
              key={exercise.e_id}
              style={{ height: "400px", display: "block" }}
            >
              <Heading size="4">{exercise.excercise_name}</Heading>
              <Flex direction="row" gap="6">
                <Flex direction="column" style={{ flex: 2 }} gap="4">
                  {/* Image column */}
                  <Heading
                    size="8"
                    style={{ color: ThemeColorPallate.cardFontColorBlack }}
                  >
                    Image
                  </Heading>
                  {exercise.excercise_image_url && (
                    <div style={{ width: "100%", height: "200px" }}>
                      <img
                        src={exercise.excercise_image_url}
                        alt="Preview"
                        style={{ width: "100%" }}
                      />
                    </div>
                  )}
                </Flex>
                <Flex direction="column" style={{ flex: 5 }}>
                  {/* Description part */}
                  <Heading
                    size="8"
                    style={{ color: ThemeColorPallate.cardFontColorBlack }}
                  >
                    Details
                  </Heading>
                  <Flex direction="row" gap="4">
                    <Flex
                      direction="column"
                      gap="2"
                      style={{ flex: 1 }}
                      align="start"
                    >
                      {/* Sets and reptitions */}
                      <Text size="4">Sets</Text>
                      <NumberComponent
                        initialValue={exercise.excercise_sets}
                        handleInputChange={handleInputChange}
                        index={index}
                        property_name="excercise_sets"
                      ></NumberComponent>
                      {/* <TextField.Root
                      type="number"
                      value={exercise.excercise_sets}
                      onChange={(e) =>
                        handleInputChange(e, index, "excercise_sets")
                      }
                      placeholder="Sets"
                    ></TextField.Root> */}
                      <Text size="4">Sets Description</Text>
                      <TextField.Root
                        value={exercise.excercise_sets_description}
                        style={{ width: "100%" }}
                        onChange={(e) =>
                          handleInputChange(
                            e,
                            index,
                            "excercise_sets_description"
                          )
                        }
                        placeholder="Sets Description"
                      ></TextField.Root>
                      <Text size="4">Reps</Text>
                      <NumberComponent
                        initialValue={exercise.excercise_reps}
                        handleInputChange={handleInputChange}
                        index={index}
                        property_name="excercise_reps"
                      ></NumberComponent>
                      <Text size="4">Reps Description</Text>

                      <TextField.Root
                        value={exercise.excercise_reps_description}
                        style={{ width: "100%" }}
                        onChange={(e) =>
                          handleInputChange(
                            e,
                            index,
                            "excercise_reps_description"
                          )
                        }
                        placeholder="Reps Description"
                      ></TextField.Root>
                    </Flex>
                    <Flex direction="column" gap="2" style={{ flex: 3 }}>
                      {/* Description */}
                      <Text size="4">Name</Text>
                      <TextField.Root
                        value={exercise.excercise_name}
                        onChange={(e) =>
                          handleInputChange(e, index, "excercise_name")
                        }
                        placeholder="Exercise Name"
                      ></TextField.Root>
                      <Text size="4">Description</Text>
                      <TextArea
                        value={exercise.excercise_description}
                        style={{ height: "12rem" }}
                        onChange={(e) =>
                          handleInputChange(e, index, "excercise_description")
                        }
                        placeholder="Description"
                      ></TextArea>
                      {/* <TextField.Root
                      value={exercise.excercise_video_url || ""}
                      onChange={(e) =>
                        handleInputChange(e, index, "excercise_video_url")
                      }
                      placeholder="Video URL"
                    /> */}
                      {/* <TextField.Root
                      value={exercise.excercise_duration || ""}
                      onChange={(e) =>
                        handleInputChange(e, index, "excercise_duration")
                      }
                      placeholder="Duration"
                    ></TextField.Root> */}
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
              {/* Add TextField.Roots for other fields similarly */}
            </Flex>
          ))}
        </Flex>
      </ScrollArea>
      <Skeleton loading={isLoading}>
        <Button onClick={() => onExcercisePlanSave()}>Create Plan</Button>
      </Skeleton>
    </Flex>
  );
};

export default CreateExcercisePlanPage;
