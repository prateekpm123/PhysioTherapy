import { iExcerciseData } from "./ExcerciseInterface";

export interface IPlannerItem {
    excercise: iExcerciseData;
    plannerListRef: React.RefObject<HTMLDivElement | null>;
    onDelete(excercise: iExcerciseData): void;
} 