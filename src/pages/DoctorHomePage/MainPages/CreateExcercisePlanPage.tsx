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
import { styled } from "@stitches/react";

// interface CreateExcercisePlanPageProps {
//   exercises: iExcerciseDataDto[];
// }

const PageContainer = styled(Flex, {
  padding: '24px 24px 24px 24px',
  gap: '24px',
  backgroundColor: ThemeColorPallate.background,
  maxHeight: '93vh',

  '@media (max-width: 768px)': {
    padding: '16px',
    gap: '16px',
  }
});

const DatePickerContainer = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  gap: '24px',
  alignItems: 'start',
  flexWrap: 'wrap',

  '@media (max-width: 768px)': {
    flexDirection: 'column',
    gap: '16px',
  }
});

const DateInput = styled('input', {
  padding: '8px 12px',
  borderRadius: '8px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  backgroundColor: ThemeColorPallate.foreground,
  color: 'white',
  fontSize: '14px',
  width: '160px',

  '&:focus': {
    outline: 'none',
    borderColor: ThemeColorPallate.primary,
  },

  '@media (max-width: 768px)': {
    width: '100%',
  }
});

const WeekdaySelector = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  gap: '12px',
  flexWrap: 'wrap',
  marginTop: '8px',

  '@media (max-width: 768px)': {
    gap: '8px',
  }
});

const WeekdayLabel = styled('label', {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '8px 12px',
  borderRadius: '8px',
  backgroundColor: ThemeColorPallate.foreground,
  color: 'white',
  cursor: 'pointer',
  transition: 'all 0.2s ease',

  '&:hover': {
    backgroundColor: ThemeColorPallate.primary + '33',
  },

  'input:checked + &': {
    backgroundColor: ThemeColorPallate.primary,
  },

  '@media (max-width: 768px)': {
    flex: '1 1 calc(33.33% - 8px)',
    justifyContent: 'center',
  }
});

const HiddenCheckbox = styled('input', {
  position: 'absolute',
  opacity: 0,
  width: 0,
  height: 0,
});

const ExerciseCard = styled(Flex, {
  backgroundColor: ThemeColorPallate.foreground,
  borderRadius: '12px',
  padding: '24px',
  marginBottom: '24px',
  gap: '24px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',

  '@media (max-width: 768px)': {
    padding: '16px',
    flexDirection: 'column !important',
  }
});

const ImageContainer = styled('div', {
  flex: '0 0 300px',
  borderRadius: '8px',
  overflow: 'hidden',
  backgroundColor: ThemeColorPallate.background,

  '@media (max-width: 768px)': {
    flex: '1',
    maxHeight: '200px',
  },

  'img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  }
});

const FormSection = styled(Flex, {
  flex: 1,
  gap: '16px',

  '@media (max-width: 768px)': {
    flexDirection: 'column !important',
  }
});

const InputGroup = styled(Flex, {
  gap: '8px',
  
  '@media (max-width: 768px)': {
    'input, textarea': {
      width: '100% !important',
    }
  }
});

const SaveButton = styled(Button, {
  marginTop: '0px',
  width: 'auto',
  alignSelf: 'flex-end',
  backgroundColor: ThemeColorPallate.primary,
  color: 'white',
  padding: '12px 24px',
  borderRadius: '8px',
  transition: 'transform 0.2s ease',

  '&:hover': {
    transform: 'scale(1.02)',
  },

  '@media (max-width: 768px)': {
    width: '100%',
    position: 'sticky',
    bottom: '16px',
    zIndex: 10,
  }
});

// Add styled component for error messages
const ErrorMessage = styled("span", {
  color: "red",
  fontSize: "0.8rem",
  marginTop: "4px",
  display: "block",
});

// Add validation interface
interface ValidationErrors {
  startDate?: string;
  endDate?: string;
  selectedDays?: string;
  exercises: {
    [key: number]: {
      excercise_name?: string;
      excercise_description?: string;
      excercise_reps?: string;
      excercise_sets?: string;
    }
  }
}

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
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    exercises: {}
  });

  const validateField = (
    name: string,
    value: string | number | boolean,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    index?: number
  ) => {
    let error = "";
    
    switch (name) {
      case "startDate":
        if (!value) error = "Start date is required";
        else if (new Date(value as string) < new Date()) {
          error = "Start date cannot be in the past";
        }
        break;
      case "endDate":
        if (!value) error = "End date is required";
        else if (startRef.current?.value && new Date(value as string) < new Date(startRef.current.value)) {
          error = "End date must be after start date";
        }
        break;
      case "selectedDays":
        if (!value) error = "At least one day must be selected";
        break;
      case "excercise_name":
        if (!value) error = "Exercise name is required";
        else if (typeof value === "string" && value.length < 2) error = "Name must be at least 2 characters";
        else if (typeof value === "string" && value.length > 200) error = "Name must be at most 200 characters";
        break;
      case "excercise_description":
        if (!value) error = "Description is required";
        else if (typeof value === "string" && value.length < 30) error = "Description must be at least 30 characters";
        else if (typeof value === "string" && value.length > 1000) error = "Description must be at most 1000 characters";
        break;
      case "excercise_reps":
        if (!value) error = "Number of repetitions is required";
        else if (Number(value) <= 0) error = "Repetitions must be greater than 0";
        else if (Number(value) > 1000) error = "Repetitions must be less than 1000";
        break;
      case "excercise_sets":
        if (!value) error = "Number of sets is required";
        else if (Number(value) <= 0) error = "Sets must be greater than 0";
        else if (Number(value) > 100) error = "Sets must be less than 100";
        break;
    }
    
    return error;
  };

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

    // Validate the field
    const error = validateField(field, e.target.value, index);
    setValidationErrors(prev => ({
      ...prev,
      exercises: {
        ...prev.exercises,
        [index]: {
          ...prev.exercises?.[index],
          [field]: error
        }
      }
    }));
  };

  const handleDateChange = (field: 'startDate' | 'endDate') => {
    const value = field === 'startDate' ? startRef.current?.value : endRef.current?.value;
    const error = validateField(field, value || '');
    setValidationErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const checked = event.target.checked;

    switch (value) {
      case "1": setMonday(checked); break;
      case "2": setTuesday(checked); break;
      case "3": setWednesday(checked); break;
      case "4": setThursday(checked); break;
      case "5": setFriday(checked); break;
      case "6": setSaturday(checked); break;
      case "7": setSunday(checked); break;
    }

    // Validate selected days
    const hasSelectedDay = [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday].some(day => day);
    const error = validateField('selectedDays', hasSelectedDay);
    setValidationErrors(prev => ({
      ...prev,
      selectedDays: error
    }));
  };

  const validateAllFields = () => {
    const errors: ValidationErrors = {
      exercises: {}
    };

    // Validate dates
    errors.startDate = validateField('startDate', startRef.current?.value || '');
    errors.endDate = validateField('endDate', endRef.current?.value || '');

    // Validate selected days
    const hasSelectedDay = [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday].some(day => day);
    errors.selectedDays = validateField('selectedDays', hasSelectedDay);

    // Validate each exercise
    excerciseBuilderPlannerList.forEach((exercise, index) => {
      errors.exercises[index] = {
        excercise_name: validateField('excercise_name', exercise.excercise_name, index),
        excercise_description: validateField('excercise_description', exercise.excercise_description, index),
        excercise_reps: validateField('excercise_reps', exercise.excercise_reps, index),
        excercise_sets: validateField('excercise_sets', exercise.excercise_sets, index)
      };
    });

    setValidationErrors(errors);
    return Object.keys(errors).length > 0 || Object.keys(errors.exercises || {}).length > 0;
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
    if (validateAllFields()) {
      showToast("Please correct the errors in the form", DefaultToastTiming, ToastColors.RED);
      return;
    }

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

  return (
    <PageContainer direction="column">
      <DatePickerContainer>
        <div>
          <Text size="4" weight="bold" style={{ marginBottom: '8px', marginRight: '10px', color: 'white' }}>
            Start Date
          </Text>
          <DateInput 
            data-testid="start-date-input" 
            ref={startRef} 
            type="date" 
            onChange={() => handleDateChange('startDate')}
          />
          {validationErrors.startDate && (
            <ErrorMessage>{validationErrors.startDate}</ErrorMessage>
          )}
        </div>
        <div>
          <Text size="4" weight="bold" style={{ marginBottom: '8px', marginRight: '10px', color: 'white' }}>
            End Date
          </Text>
          <DateInput 
            data-testid="end-date-input" 
            ref={endRef} 
            type="date"
            onChange={() => handleDateChange('endDate')}
          />
          {validationErrors.endDate && (
            <ErrorMessage>{validationErrors.endDate}</ErrorMessage>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <Text size="4" weight="bold" style={{ marginBottom: '8px', color: 'white' }}>
            Select Days
          </Text>
          <WeekdaySelector>
            {[
              { label: 'Mon', state: Monday, setter: setMonday, value: '1' },
              { label: 'Tue', state: Tuesday, setter: setTuesday, value: '2' },
              { label: 'Wed', state: Wednesday, setter: setWednesday, value: '3' },
              { label: 'Thu', state: Thursday, setter: setThursday, value: '4' },
              { label: 'Fri', state: Friday, setter: setFriday, value: '5' },
              { label: 'Sat', state: Saturday, setter: setSaturday, value: '6' },
              { label: 'Sun', state: Sunday, setter: setSunday, value: '7' },
            ].map((day) => (
              <div key={day.value} style={{ position: 'relative' }}>
                <HiddenCheckbox
                  type="checkbox"
                  checked={day.state}
                  value={day.value}
                  onChange={handleCheckboxChange}
                  id={`day-${day.value}`}
                />
                <WeekdayLabel htmlFor={`day-${day.value}`}>
                  {day.label}
                </WeekdayLabel>
              </div>
            ))}
          </WeekdaySelector>
          {validationErrors.selectedDays && (
            <ErrorMessage>{validationErrors.selectedDays}</ErrorMessage>
          )}
        </div>
      </DatePickerContainer>

      <ScrollArea style={{ height: '50.5rem' }}>
        {excerciseBuilderPlannerList.map((exercise, index) => (
          <ExerciseCard key={exercise.e_id}>
            <ImageContainer>
              {exercise.excercise_image_url && (
                <img src={exercise.excercise_image_url} alt={exercise.excercise_name} />
              )}
            </ImageContainer>

            <FormSection direction="column" gap="4">
              <Heading size="4" style={{ color: 'white' }}>{exercise.excercise_name}</Heading>
              
              <FormSection direction="row">
                <InputGroup direction="column" style={{ flex: 1 }}>
                  <Text size="3" style={{ color: 'white' }}>Sets</Text>
                  <NumberComponent
                    initialValue={exercise.excercise_sets}
                    handleInputChange={handleInputChange}
                    index={index}
                    property_name="excercise_sets"
                  />
                  {validationErrors.exercises[index]?.excercise_sets && (
                    <ErrorMessage>{validationErrors.exercises[index].excercise_sets}</ErrorMessage>
                  )}
                  
                  <Text size="3" style={{ color: 'white' }}>Sets Description</Text>
                  <TextField.Root
                    value={exercise.excercise_sets_description}
                    onChange={(e) => handleInputChange(e, index, "excercise_sets_description")}
                    placeholder="Sets Description"
                  />
                  
                  <Text size="3" style={{ color: 'white' }}>Reps</Text>
                  <NumberComponent
                    initialValue={exercise.excercise_reps}
                    handleInputChange={handleInputChange}
                    index={index}
                    property_name="excercise_reps"
                  />
                  {validationErrors.exercises[index]?.excercise_reps && (
                    <ErrorMessage>{validationErrors.exercises[index].excercise_reps}</ErrorMessage>
                  )}
                  
                  <Text size="3" style={{ color: 'white' }}>Reps Description</Text>
                  <TextField.Root
                    value={exercise.excercise_reps_description}
                    onChange={(e) => handleInputChange(e, index, "excercise_reps_description")}
                    placeholder="Reps Description"
                  />
                </InputGroup>

                <InputGroup direction="column" style={{ flex: 2 }}>
                  <Text size="3" style={{ color: 'white' }}>Exercise Name</Text>
                  <TextField.Root
                    value={exercise.excercise_name}
                    onChange={(e) => handleInputChange(e, index, "excercise_name")}
                    placeholder="Exercise Name"
                  />
                  {validationErrors.exercises[index]?.excercise_name && (
                    <ErrorMessage>{validationErrors.exercises[index].excercise_name}</ErrorMessage>
                  )}
                  
                  <Text size="3" style={{ color: 'white' }}>Description</Text>
                  <TextArea
                    value={exercise.excercise_description}
                    style={{ height: '150px', resize: 'vertical' }}
                    onChange={(e) => handleInputChange(e, index, "excercise_description")}
                    placeholder="Description"
                  />
                  {validationErrors.exercises[index]?.excercise_description && (
                    <ErrorMessage>{validationErrors.exercises[index].excercise_description}</ErrorMessage>
                  )}
                </InputGroup>
              </FormSection>
            </FormSection>
          </ExerciseCard>
        ))}
      </ScrollArea>

      <Skeleton loading={isLoading}>
        <SaveButton onClick={onExcercisePlanSave}>
          Create Plan
        </SaveButton>
      </Skeleton>
    </PageContainer>
  );
};

export default CreateExcercisePlanPage;
