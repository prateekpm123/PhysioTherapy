import { Button, Flex, Skeleton, Text, Card, Checkbox } from "@radix-ui/themes";
import React, { useState, useMemo, useEffect } from "react";
import {
  iExcerciseDataDto,
  iExcerciseCompletionDto,
  iExcercisePlanDto,
} from "../models/ExcerciseInterface";
import { useExcercisePlanDetails } from "../pages/DoctorHomePage/MainPages/ExcercisePlanDetailsPage";
import { useCurrentMainScreenContext } from "../pages/DoctorHomePage/DoctorHomePage";
import { useNavigate, useParams } from "react-router-dom";
import { styled } from "@stitches/react";
import { themeColors, spacing, theme } from "../theme/theme";

interface iWeeklyCarouselProps {
  startDate: Date;
  endDate: Date;
  excercises: iExcerciseDataDto[];
  selectedDays: string;
  excercisePlan?: iExcercisePlanDto;
  onChange?: (data: iExcerciseCompletionDto[]) => void;
}

// --- Styled Components --- //

const CarouselContainer = styled(Flex, {
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  backgroundColor: themeColors.background.paper,
  padding: spacing.md,
  borderRadius: theme.radius[3],
  boxShadow: theme.shadows[2],

  "@media (max-width: 768px)": {
    padding: spacing.sm,
  }
});

const Navigation = styled(Flex, {
  justifyContent: 'center',
  gap: spacing.sm,
  marginBottom: spacing.md,
  width: '100%',

  "& button": {
    padding: `${spacing.xs} ${spacing.sm}`,
  },

  "@media (max-width: 768px)": {
    flexWrap: 'wrap',
    "& button": {
      flexGrow: 1,
    },
  }
});

const WeekViewContainer = styled('div', {
  display: 'flex',
  overflowX: 'auto',
  width: '100%',
  paddingBottom: spacing.sm, // Space for scrollbar

  /* Styling scrollbar for Webkit browsers */
  '&::-webkit-scrollbar': {
    height: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: themeColors.background.elevation1,
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: themeColors.primary[500],
    borderRadius: '4px',
    '&:hover': {
      background: themeColors.primary[600],
    }
  },
});

const DayColumn = styled(Card, {
  minWidth: '120px',
  maxWidth: '150px',
  marginRight: spacing.sm,
  padding: spacing.sm,
  textAlign: 'center',
  border: '1px solid transparent',
  transition: 'background-color 0.2s ease',
  flexShrink: 0,

  variants: {
    isSelected: {
      true: {
        backgroundColor: themeColors.background.elevation2,
        borderColor: themeColors.primary[500],
      }
    },
    isCurrent: {
      true: {
        backgroundColor: themeColors.primary[900], // Darker blue for current day
        borderColor: themeColors.primary[400],
        color: themeColors.text.primary, // Ensure text is visible
        '& p': { // Ensure child Text elements are also visible
          color: themeColors.text.primary,
        },
        '& h3': { // Ensure child heading elements are also visible
          color: themeColors.text.primary,
        }
      }
    }
  },

  '&:last-child': {
    marginRight: 0,
  },

  "@media (max-width: 768px)": {
    minWidth: '100px',
    padding: spacing.xs,
  }
});

const ExerciseRow = styled(Flex, {
  alignItems: 'center',
  justifyContent: 'center',
  padding: `${spacing.xs} 0`,
  minHeight: '40px', // Ensure consistent height
});

const ExerciseNameContainer = styled(Flex, {
  flexDirection: 'column',
  alignItems: 'flex-start', // Align names to the left
  paddingRight: spacing.md, // Space before day columns start
  paddingTop: `calc(${spacing.sm} + 28px)`, // Align with checkboxes approximately (adjust as needed)

  "@media (max-width: 768px)": {
    paddingTop: `calc(${spacing.xs} + 28px)`,
  }
});

const ExerciseName = styled(Text, {
  fontSize: '0.9rem',
  color: themeColors.text.secondary,
  fontWeight: '500',
  minHeight: '40px', // Match ExerciseRow height
  display: 'flex',
  alignItems: 'center',
});

const TrackButton = styled(Button, {
  marginTop: spacing.sm,
  width: '100%',
  fontSize: '0.8rem',
  padding: `${spacing.xs} ${spacing.sm}`,

  "@media (max-width: 768px)": {
     fontSize: '0.75rem',
     padding: `${spacing.xs}`,
  }
});

function WeeklyCarousel({
  startDate,
  endDate,
  excercises,
  selectedDays,
  onChange,
}: iWeeklyCarouselProps) {
  const { excercisePlan, excerciseCompletionData, setExcerciseCompletionData } =
    useExcercisePlanDetails();
  const { isExcercisePlanTrackingLoading } = useCurrentMainScreenContext();
  const navigate = useNavigate();
  const { pid, epid } = useParams();
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);

  const weeks = useMemo(() => {
    if (!startDate || !endDate) return [];

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const numWeeks = Math.ceil(diffDays / 7);

    const weekArrays = [];
    const currentDate = new Date(start);

    for (let i = 0; i < numWeeks; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        week.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      weekArrays.push(week);
    }
    return weekArrays;
  }, [startDate, endDate]);

  const handlePrevWeek = () => {
    setCurrentWeekIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNextWeek = () => {
    setCurrentWeekIndex((prevIndex) =>
      Math.min(prevIndex + 1, weeks.length - 1)
    );
  };

  const handleCurrentWeek = () => {
    if (!weeks.length) return;

    const today = new Date();
    let foundIndex = -1;

    for (let i = 0; i < weeks.length; i++) {
      if (weeks[i].some((date) => isSameWeek(date, today))) {
        foundIndex = i;
        break;
      }
    }

    if (foundIndex !== -1) {
      setCurrentWeekIndex(foundIndex);
    }
  };

  const isSameWeek = (date1: Date, date2: Date) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    const diff = Math.round(
      (d1.getTime() - d2.getTime()) / (7 * 24 * 60 * 60 * 1000)
    );
    return (
      diff === 0 &&
      Math.floor(d1.getTime() / 604800000) ===
        Math.floor(d2.getTime() / 604800000)
    );
  };

  const isChecked = (e_id: string, date: Date) => {
    const found = excerciseCompletionData.find(
      (item: iExcerciseCompletionDto) => {
        return (
          item.excerciseId === e_id &&
          item.date.slice(0, 10) == date.toISOString().slice(0, 10)
        );
      }
    );
    if (found?.completed) {
      return true;
    } else {
      return false;
    }
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    e_id: string,
    date: Date
  ) => {
    const isChecked = e.target.checked;
    const dateString = date.toISOString().slice(0, 10);

    setExcerciseCompletionData((prevData) => {
      const existingIndex = prevData.findIndex(
        (item) =>
          item.excerciseId === e_id && item.date.slice(0, 10) === dateString
      );

      if (existingIndex !== -1) {
        const newData = [...prevData];
        newData[existingIndex] = {
          ...newData[existingIndex],
          completed: isChecked,
        };
        return newData;
      } else {
        return [
          ...prevData,
          {
            excercisePlanId: excercisePlan.ep_id,
            excerciseId: e_id,
            date: dateString,
            completed: isChecked,
          },
        ];
      }
    });
  };

  useEffect(() => {
    if (onChange) {
      onChange(excerciseCompletionData);
    }
  }, [excerciseCompletionData, onChange]);

  const selectedDaysArray = useMemo(() => {
    return selectedDays ? selectedDays.split(",").map(Number) : [];
  }, [selectedDays]);

  const isSelectedDay = (date: Date) => {
    if (selectedDaysArray) {
      return selectedDaysArray.includes(
        date.getDay() === 0 ? 7 : date.getDay()
      );
    }
  };

  const isCurrentDay = (date: Date) => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const onTrackSession = (date: Date) => {
    navigate(
      `/doctorhome/main/patientDetails/${pid}/excercisePlans/${epid}/trackSession`,
      {
        state: {
          excercisePlan: excercisePlan,
          sessionDate: date,
        },
      }
    );
  };

  if (!weeks.length || !excercises.length) {
    // Handle loading or no data state more gracefully
    return (
      <CarouselContainer>
         <Text>Loading exercise plan...</Text>
      </CarouselContainer>
    );
  }

  return (
    <CarouselContainer>
      <Navigation>
        <Button variant="soft" onClick={handlePrevWeek} disabled={currentWeekIndex === 0}>
          Previous Week
        </Button>
        <Button variant="solid" onClick={handleCurrentWeek}>Current Week</Button>
        <Button
          variant="soft"
          onClick={handleNextWeek}
          disabled={currentWeekIndex === weeks.length - 1}
        >
          Next Week
        </Button>
      </Navigation>

      <Flex direction="row" width="100%">
        {/* Exercise Names Column */}
        <ExerciseNameContainer>
          {excercises.map((exercise) => (
            <Skeleton key={exercise.e_id} loading={isExcercisePlanTrackingLoading}>
                <ExerciseName>{exercise.excercise_name}</ExerciseName>
            </Skeleton>
          ))}
        </ExerciseNameContainer>

        {/* Weekly View - Horizontal Scroll */}
        <WeekViewContainer>
          {weeks[currentWeekIndex].map((date) => (
            <DayColumn
              key={date.toISOString()}
              isSelected={isSelectedDay(date)}
              isCurrent={isCurrentDay(date)}
            >
              <Text size="2" weight="bold">
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </Text>
              <Text size="1" color="gray">{date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })}</Text>
              <Flex direction="column" mt="2">
                {excercises.map((exercise) => (
                  <ExerciseRow key={`${exercise.e_id}-${date.toISOString()}`}>
                    <Skeleton loading={isExcercisePlanTrackingLoading}>
                       <Checkbox
                          // Using Radix Checkbox for better styling consistency
                          checked={isChecked(exercise.e_id, date)}
                          onCheckedChange={(checked) => {
                              // Adapt handler for Radix Checkbox's onCheckedChange
                              const syntheticEvent = {
                                  target: { checked: !!checked }, // Mimic event structure
                              } as React.ChangeEvent<HTMLInputElement>;
                              handleCheckboxChange(syntheticEvent, exercise.e_id, date);
                          }}
                       />
                    </Skeleton>
                  </ExerciseRow>
                ))}
              </Flex>
              <TrackButton variant="outline" size="1" onClick={() => onTrackSession(date)}>
                Track session
              </TrackButton>
            </DayColumn>
          ))}
        </WeekViewContainer>
      </Flex>
    </CarouselContainer>
  );
}

export default WeeklyCarousel;
