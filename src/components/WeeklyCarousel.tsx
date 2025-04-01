// import { Button, Flex } from "@radix-ui/themes";
// import React, { useState, useMemo } from "react";
// import { iExcerciseDataDto } from "../models/ExcerciseInterface";

// interface iWeeklyCarouselProps {
//   startDate: Date;
//   endDate: Date;
//   excercises: iExcerciseDataDto[];
//   onChange?: () => void;
// }

// function WeeklyCarousel({
//   startDate,
//   endDate,
//   excercises,
// }: iWeeklyCarouselProps) {
//   const [currentWeekIndex, setCurrentWeekIndex] = useState(0);

//   const weeks = useMemo(() => {
//     if (!startDate || !endDate) return [];

//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     const diffTime = Math.abs(end.getTime() - start.getTime());
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     const numWeeks = Math.ceil(diffDays / 7);

//     const weekArrays = [];
//     const currentDate = new Date(start);

//     for (let i = 0; i < numWeeks; i++) {
//       const week = [];
//       for (let j = 0; j < 7; j++) {
//         week.push(new Date(currentDate));
//         currentDate.setDate(currentDate.getDate() + 1);
//       }
//       weekArrays.push(week);
//     }
//     return weekArrays;
//   }, [startDate, endDate]);

//   const handlePrevWeek = () => {
//     setCurrentWeekIndex((prevIndex) => Math.max(prevIndex - 1, 0));
//   };

//   const handleNextWeek = () => {
//     setCurrentWeekIndex((prevIndex) =>
//       Math.min(prevIndex + 1, weeks.length - 1)
//     );
//   };

//   const handleCurrentWeek = () => {
//     if (!weeks.length) return;

//     const today = new Date();
//     let foundIndex = -1;

//     for (let i = 0; i < weeks.length; i++) {
//       if (weeks[i].some((date) => isSameWeek(date, today))) {
//         foundIndex = i;
//         break;
//       }
//     }

//     if (foundIndex !== -1) {
//       setCurrentWeekIndex(foundIndex);
//     }
//   };

//   const isSameWeek = (date1: Date, date2: Date) => {
//     const d1 = new Date(date1);
//     const d2 = new Date(date2);
//     d1.setHours(0, 0, 0, 0);
//     d2.setHours(0, 0, 0, 0);
//     // const day1 = d1.getDay();
//     // const day2 = d2.getDay();
//     const diff = Math.round(
//       (d1.getTime() - d2.getTime()) / (7 * 24 * 60 * 60 * 1000)
//     );
//     return (
//       diff === 0 &&
//       Math.floor(d1.getTime() / 604800000) ===
//         Math.floor(d2.getTime() / 604800000)
//     );
//   };

//   // Based on the Excercise Completion table data, I'll mark a check box completed or not
//   const isChecked = (e_id: string, date: Date) => {
//     // I'll check these two params from the data from Excercise complettion table and determine is they are checked or not
//     console.log(e_id, date);
//     return true;
//   };

//   if (!weeks.length) {
//     return <p>Please select start and end dates.</p>;
//   }

//   return (
//     <div>
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           marginBottom: "10px",
//         }}
//       >
//         <Button onClick={handlePrevWeek} disabled={currentWeekIndex === 0}>
//           Previous Week
//         </Button>
//         <Button onClick={handleCurrentWeek}>Current Week</Button>
//         <Button
//           onClick={handleNextWeek}
//           disabled={currentWeekIndex === weeks.length - 1}
//         >
//           Next Week
//         </Button>
//       </div>

//       <Flex direction="row" justify="center" align="center">
//         <Flex direction="column" mt="4">
//           {excercises.map((exercise) => (
//             <div key={exercise.e_id} style={{ margin: "0 10px" }}>
//               <h3>{exercise.excercise_name}</h3>
//             </div>
//           ))}
//         </Flex>
//         {weeks[currentWeekIndex].map((date) => (
//           <div key={date.toISOString()} style={{ margin: "0 10px" }}>
//             {date.toLocaleDateString()}
//             <Flex direction="column">
//               {excercises.map((exercise) => (
//                 <div key={exercise.e_id} style={{ margin: "0 10px" }}>
//                   <input
//                     type="checkbox"
//                     name={exercise.e_id}
//                     value={date.toISOString()}
//                     checked={isChecked(exercise.e_id, date)}
//                   />
//                 </div>
//               ))}
//             </Flex>
//           </div>
//         ))}
//       </Flex>
//     </div>
//   );
// }

// export default WeeklyCarousel;

// import { Button, Flex } from "@radix-ui/themes";
// import React, { useState, useMemo, useEffect } from "react";
// import { iExcerciseCompletionDto, iExcerciseDataDto } from "../models/ExcerciseInterface";

// interface iWeeklyCarouselProps {
//   startDate: Date;
//   endDate: Date;
//   excercises: iExcerciseDataDto[];
//   selectedDays: string; // Comma-separated days ("1,2,3,4,5,6,7")
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   onChange?: (data: any[]) => void;
// }

// function WeeklyCarousel({
//   startDate,
//   endDate,
//   excercises,
//   selectedDays,
//   onChange,
// }: iWeeklyCarouselProps) {
//   const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
//   const [excerciseCompletionData, setExcerciseCompletionData] = useState([]); // State to store data for API

//   const weeks = useMemo(() => {
//     if (!startDate || !endDate) return [];

//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     const diffTime = Math.abs(end.getTime() - start.getTime());
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     const numWeeks = Math.ceil(diffDays / 7);

//     const weekArrays = [];
//     const currentDate = new Date(start);

//     for (let i = 0; i < numWeeks; i++) {
//       const week = [];
//       for (let j = 0; j < 7; j++) {
//         week.push(new Date(currentDate));
//         currentDate.setDate(currentDate.getDate() + 1);
//       }
//       weekArrays.push(week);
//     }
//     return weekArrays;
//   }, [startDate, endDate]);

//   const handlePrevWeek = () => {
//     setCurrentWeekIndex((prevIndex) => Math.max(prevIndex - 1, 0));
//   };

//   const handleNextWeek = () => {
//     setCurrentWeekIndex((prevIndex) =>
//       Math.min(prevIndex + 1, weeks.length - 1)
//     );
//   };

//   const handleCurrentWeek = () => {
//     if (!weeks.length) return;

//     const today = new Date();
//     let foundIndex = -1;

//     for (let i = 0; i < weeks.length; i++) {
//       if (weeks[i].some((date) => isSameWeek(date, today))) {
//         foundIndex = i;
//         break;
//       }
//     }

//     if (foundIndex !== -1) {
//       setCurrentWeekIndex(foundIndex);
//     }
//   };

//   const isSameWeek = (date1: Date, date2: Date) => {
//     const d1 = new Date(date1);
//     const d2 = new Date(date2);
//     d1.setHours(0, 0, 0, 0);
//     d2.setHours(0, 0, 0, 0);
//     const diff = Math.round(
//       (d1.getTime() - d2.getTime()) / (7 * 24 * 60 * 60 * 1000)
//     );
//     return (
//       diff === 0 &&
//       Math.floor(d1.getTime() / 604800000) ===
//         Math.floor(d2.getTime() / 604800000)
//     );
//   };

//   const isChecked = (e_id: string, date: Date) => {
//     const found = excerciseCompletionData.find(
//       (item: iExcerciseCompletionDto) => item.excercisePlanId === e_id && item.date === date.toISOString()
//     );
//     return !!found && found[0];
//   };

//   const handleCheckboxChange = (e_id: string, date: Date, checked: boolean) => {
//     const dateStr = date.toISOString();
//     setExcerciseCompletionData((prevData) => {
//       const existing = prevData.find(
//         (item: iExcerciseCompletionDto) => item.excerciseId === e_id && item.date === dateStr
//       );
//       if (existing) {
//         return prevData.map((item: iExcerciseCompletionDto) =>
//           item.excerciseId === e_id && item.date === dateStr
//             ? { ...item, completed: checked }
//             : item
//         );
//       } else {
//         return [...prevData, { e_id, date: dateStr, completed: checked }];
//       }
//     });
//   };

//   useEffect(() => {
//     if (onChange) {
//       onChange(excerciseCompletionData);
//     }
//   }, [excerciseCompletionData, onChange]);

//   const selectedDaysArray = useMemo(
//     () => selectedDays.split(",").map(Number),
//     [selectedDays]
//   );

//   const isSelectedDay = (date: Date) => {
//     return selectedDaysArray.includes(date.getDay() === 0 ? 7 : date.getDay());
//   };

//   const isCurrentDay = (date: Date) => {
//     const today = new Date();
//     return (
//       date.getFullYear() === today.getFullYear() &&
//       date.getMonth() === today.getMonth() &&
//       date.getDate() === today.getDate()
//     );
//   };

//   if (!weeks.length) {
//     return <p>Please select start and end dates.</p>;
//   }

//   return (
//     <div>
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           marginBottom: "10px",
//         }}
//       >
//         <Button onClick={handlePrevWeek} disabled={currentWeekIndex === 0}>
//           Previous Week
//         </Button>
//         <Button onClick={handleCurrentWeek}>Current Week</Button>
//         <Button
//           onClick={handleNextWeek}
//           disabled={currentWeekIndex === weeks.length - 1}
//         >
//           Next Week
//         </Button>
//       </div>

//       <Flex direction="row" justify="center" align="center">
//         <Flex direction="column" mt="4">
//           {excercises.map((exercise) => (
//             <div key={exercise.e_id} style={{ margin: "0 10px" }}>
//               <h3>{exercise.excercise_name}</h3>
//             </div>
//           ))}
//         </Flex>
//         {weeks[currentWeekIndex].map((date) => (
//           <div
//             key={date.toISOString()}
//             style={{
//               margin: "0 10px",
//               backgroundColor: isSelectedDay(date)
//                 ? "lightblue"
//                 : isCurrentDay(date)
//                 ? "lightgreen"
//                 : "transparent",
//             }}
//           >
//             {date.toLocaleDateString()}
//             <Flex direction="column">
//               {excercises.map((exercise) => (
//                 <div key={exercise.e_id} style={{ margin: "0 10px" }}>
//                   <input
//                     type="checkbox"
//                     name={exercise.e_id}
//                     value={date.toISOString()}
//                     checked={isChecked(exercise.e_id, date)}
//                     onChange={(e) =>
//                       handleCheckboxChange(exercise.e_id, date, e.target.checked)
//                     }
//                   />
//                 </div>
//               ))}
//             </Flex>
//           </div>
//         ))}
//       </Flex>
//     </div>
//   );
// }

// export default WeeklyCarousel;

import { Button, Flex } from "@radix-ui/themes";
import React, { useState, useMemo, useEffect } from "react";
import {
  iExcerciseDataDto,
  iExcerciseCompletionDto,
  // iExcerciseCompletionData,
} from "../models/ExcerciseInterface";
import ThemeColorPallate from "../assets/ThemeColorPallate";
import { useExcercisePlanDetails } from "../pages/DoctorHomePage/MainPages/ExcercisePlanDetailsPage";

interface iWeeklyCarouselProps {
  startDate: Date;
  endDate: Date;
  excercises: iExcerciseDataDto[];
  selectedDays: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  excercisePlan: any; // Add excercisePlan prop
  onChange?: (data: iExcerciseCompletionDto[]) => void;
}

function WeeklyCarousel({
  startDate,
  endDate,
  excercises,
  selectedDays,
  onChange,
}: iWeeklyCarouselProps) {
  const { excercisePlan, excerciseCompletionData, setExcerciseCompletionData } =
    useExcercisePlanDetails();

  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  // const [excerciseCompletionData, setExcerciseCompletionData] = useState<
  //   iExcerciseCompletionDto[]
  // >(excercisePlan?.excercise_completion || []);

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
    if (found) {
      return true;
    } else {
      return false;
    }
    // return !!found && found;
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
            // ec_id: `${e_id}-${dateString}`,
            excercisePlanId: excercisePlan.ep_id, // Use excercisePlan.ep_id
            excercisePlan: excercisePlan, // Add excercisePlan
            excerciseId: e_id,
            excercises: excercises.filter((ex) => ex.e_id === e_id), // Add excercises
            excercise_completion: [], // Add an empty array for excercise_completion
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

  if (!weeks.length) {
    return <p>Please select start and end dates.</p>;
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "10px",
        }}
      >
        <Button onClick={handlePrevWeek} disabled={currentWeekIndex === 0}>
          Previous Week
        </Button>
        <Button onClick={handleCurrentWeek}>Current Week</Button>
        <Button
          onClick={handleNextWeek}
          disabled={currentWeekIndex === weeks.length - 1}
        >
          Next Week
        </Button>
      </div>

      <Flex direction="row" justify="center" align="center">
        <Flex direction="column" mt="4">
          {excercises.map((exercise) => (
            <div key={exercise.e_id} style={{ margin: "0 10px" }}>
              <h3>{exercise.excercise_name}</h3>
            </div>
          ))}
        </Flex>
        {weeks[currentWeekIndex].map((date) => (
          <div
            key={date.toISOString()}
            style={{
              margin: "0 10px",
              backgroundColor: isSelectedDay(date)
                ? ThemeColorPallate.foreground
                : isCurrentDay(date)
                ? ThemeColorPallate.primary
                : "transparent",
            }}
          >
            {date.toLocaleDateString()}
            <Flex direction="column">
              {excercises.map((exercise) => (
                <div key={exercise.e_id} style={{ margin: "0 10px" }}>
                  <input
                    type="checkbox"
                    name={exercise.e_id}
                    value={date.toISOString()}
                    checked={isChecked(exercise.e_id, date)}
                    onChange={(e) =>
                      handleCheckboxChange(e, exercise.e_id, date)
                    }
                  />
                </div>
              ))}
            </Flex>
          </div>
        ))}
      </Flex>
    </div>
  );
}

export default WeeklyCarousel;
