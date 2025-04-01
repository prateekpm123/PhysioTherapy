// export interface iExcerciseData {
//     name: string;
//     imgSrc: string;
//     description: IExcerciseDescrition;
//     type: string;
//     tags: string[];
//     excerciseKey?: string;
//     // onDelete(): void;
//     // onEdit(): void;
//     // onProductClick(): void;
// }

export interface iExcerciseData {
  excercise_name: string;
  excercise_description: string;
  excercise_video_url: string;
  excercise_image_url: string;
  excercise_duration: string;
  excercise_reps: number;
  excercise_reps_description: string;
  excercise_sets: number;
  excercise_sets_description: string;
  excercise_category: string;
  excercise_type: string;
  excercise_tags: string;
  excercise_level: string;
  excercise_equipment: string;
  excercise_target: string;
  excercise_benefits: string;
  excercise_precautions: string;
  excercise_variations: string;
  excercise_mistakes: string;
  excercise_tips: string;
  excercise_created_by: string; // this would have doctor id
}

export interface iExcerciseDataDto extends iExcerciseData {
  e_id: string;
  excercise_created_on: Date;
  modified_created_on: Date;
}

export interface iExcercisePlanDto {
  ep_id: string;
  startDate: Date;
  endDate: Date;
  selected_days: string;
  date_created: Date;
  date_updated: Date;
  version: string;
  patient_id: string;
  excercise: iExcerciseDataDto[];
  excercise_plan_created_on: string;
  excercise_plan_notes: string[];
}

export interface iExcerciseTile {
  excercise: iExcerciseDataDto;
  excerciseKey: string;
  viewType: ExcerciseType;
  onAdd(excercise: iExcerciseDataDto): void;
  onEdit(): void;
  onClick?(): void;
  onExcerciseTileClick?: (
    excercise: iExcerciseDataDto,
    excerciseKey: string
  ) => void;
  refreshExcercise: () => void;
}

export interface iExcerciseCompletionData {
  excercisePlanId: string;
  excercisePlan: iExcercisePlanDto;
  excerciseId: string;
  excercises: iExcerciseDataDto[];
  date: string;
  completed: boolean;
}

export interface iExcerciseCompletionDto extends iExcerciseCompletionData {
    ec_id: string;
}

export enum ExcerciseType {
  FULL_VIEW,
  MOBILE_VIEW,
}

// interface IExcerciseDescrition {
//     sets: number;
//     setsDescription: string;
//     repititions: number;
//     repititionsDescription: string;
//     Cues: IExcerciseCues;
// }

// interface IExcerciseCues {
//     Points: string[];
// }
