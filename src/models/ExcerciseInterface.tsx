
export interface iExcerciseData {
    name: string;
    imgSrc: string;
    description: IExcerciseDescrition;
    type: string;
    tags: string[];
    // onDelete(): void;
    // onEdit(): void;
    // onProductClick(): void;
}

export interface iExcerciseTile {
    excercise: iExcerciseData;
    onAdd(excercise: iExcerciseData): void;
    onClick?(): void;
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