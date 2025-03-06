
export interface iExcerciseData {
    name: string;
    imgSrc: string;
    description: IExcerciseDescrition;
    type: string;
    tags: string[];
    excerciseKey?: string;
    // onDelete(): void;
    // onEdit(): void;
    // onProductClick(): void;
}

export interface iExcerciseTile {
    excercise: iExcerciseData;
    excerciseKey: string;
    viewType: ExcerciseType;
    onAdd(excercise: iExcerciseData): void;
    onEdit(): void;
    onClick?(): void;
    onExcerciseTileClick?: (excercise: iExcerciseData, excerciseKey: string)=> void;
    refreshExcercise: ()=>void;
}

export enum ExcerciseType {
    FULL_VIEW, MOBILE_VIEW
}

interface IExcerciseDescrition {
    sets: number;
    setsDescription: string;
    repititions: number;
    repititionsDescription: string;
    Cues: IExcerciseCues;
}

interface IExcerciseCues {
    Points: string[];
}