import { useSelector } from "react-redux";
import { UserSessionStateType } from "../../stores/userSessionStore";
import { useNavigate } from "react-router-dom";
// import { User } from "../../models/IUser";
// import DoctorNavBar from "./DoctorNavBar";
// import { Flex, Text } from "@radix-ui/themes";
import { Outlet } from "react-router-dom";
import ThemeColorPallate from "../../assets/ThemeColorPallate";
import { createContext, useContext, useEffect, useState } from "react";
import { iPatientDto, iPatientFullData } from "../../dtos/PatientDto";
import { iExcerciseDataDto } from "../../models/ExcerciseInterface";
import { BreadcrumbItem } from "./MainPages/DoctorMiniNavBarBreadCrumb";
// import { useNewPatientBreadcrumbItems } from "./DoctorHomeLandingPage";
// import { iPatientDto } from "../../dtos/PatientDto";

export enum DoctorHomeMainScreen {
  NEW_PATIENT_ENTRY = 1,
  PATIENT_DETAILS = 2,
  EXCERCISE_BUILDER = 3,
  CREATE_EXCERCISE_PLAN = 4,
}

interface DoctorContext {
  currentMainScreen: DoctorHomeMainScreen;
  setCurrentMainScreen: React.Dispatch<
    React.SetStateAction<DoctorHomeMainScreen>
  >;

  breadCrumbItems: BreadcrumbItem[];
  setBreadCrumbItems: React.Dispatch<React.SetStateAction<BreadcrumbItem[]>>;

  currentPatientDetails?: iPatientFullData;
  setCurrentPatientDetails?: React.Dispatch<
    React.SetStateAction<iPatientFullData>
  >;
  isPatientDetailsScreenRefresh: boolean;
  setIsPatientDetailScreenRefresh: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  isPatientListScreenRefresh: boolean;
  setIsPatientListScreenRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  patientDetailsLoading: boolean;
  setPatientDetailsLoading: React.Dispatch<React.SetStateAction<boolean>>;

  isExcerciseBuilderLoading: boolean;
  setIsExcerciseBuilderLoading: React.Dispatch<React.SetStateAction<boolean>>;

  isExcerciseBuilderRefresh: boolean;
  setIsExcerciseBuilderRefresh: React.Dispatch<React.SetStateAction<boolean>>;

  isExcercisePlanTrackingRefresh: boolean;
  setIsExcercisePlanTrackingRefresh: React.Dispatch<
    React.SetStateAction<boolean>
  >;


  isExcercisePlanTrackingSessionRefresh: boolean;
  setIsExcercisePlanTrackingSessionRefresh: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  isExcercisePlanTrackingLoading: boolean;
  setIsExcercisePlanTrackingLoading: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  excerciseBuilderPlannerList: iExcerciseDataDto[];
  setExcerciseBuilderPlannerList: React.Dispatch<
    React.SetStateAction<iExcerciseDataDto[]>
  >;
}

// Create a context for the state variable
const CurrentMainScreenContext = createContext<DoctorContext | undefined>(
  undefined
);

export const useCurrentMainScreenContext = () => {
  const context = useContext(CurrentMainScreenContext);
  if (!context) {
    throw new Error("useMyState must be used within a MyStateProvider");
  }
  return context;
};

export const DoctorHomePage = () => {
  const isSignedIn = useSelector(
    (state: UserSessionStateType) => state.userSession.isSignedIn
  );
  const navigate = useNavigate();
  // const location = useLocation();

  const [currentMainScreen, setCurrentMainScreen] = useState(
    DoctorHomeMainScreen.NEW_PATIENT_ENTRY
  );

  // const newPatientBreadcrumbItems: BreadcrumbItem[] = useNewPatientBreadcrumbItems();
  const [breadCrumbItems, setBreadCrumbItems] = useState(
    {} as BreadcrumbItem[]
  );

  const [patientDetailsLoading, setPatientDetailsLoading] = useState(false);
  const [isExcerciseBuilderLoading, setIsExcerciseBuilderLoading] =
    useState(false);

  const [currentPatientDetails, setCurrentPatientDetails] = useState(
    {} as iPatientDto
  );

  const [isPatientDetailsScreenRefresh, setIsPatientDetailScreenRefresh] =
    useState(false);
  const [isPatientListScreenRefresh, setIsPatientListScreenRefresh] =
    useState(false);
  const [isExcerciseBuilderRefresh, setIsExcerciseBuilderRefresh] =
    useState(false);
  const [isExcercisePlanTrackingRefresh, setIsExcercisePlanTrackingRefresh] =
    useState(false);
    const [isExcercisePlanTrackingSessionRefresh, setIsExcercisePlanTrackingSessionRefresh] =
    useState(false);
  const [isExcercisePlanTrackingLoading, setIsExcercisePlanTrackingLoading] =
    useState(false);
  const [excerciseBuilderPlannerList, setExcerciseBuilderPlannerList] =
    useState([] as iExcerciseDataDto[]);

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/signup");
      return;
    }
  });

  // const user: User = useSelector(
  // (state: UserSessionStateType) => state.userSession.user
  // );

  return (
    <>
      <CurrentMainScreenContext.Provider
        value={{
          breadCrumbItems,
          setBreadCrumbItems,
          currentMainScreen,
          setCurrentMainScreen,
          currentPatientDetails,
          setCurrentPatientDetails,
          isPatientDetailsScreenRefresh,
          setIsPatientDetailScreenRefresh,
          isPatientListScreenRefresh,
          setIsPatientListScreenRefresh,
          patientDetailsLoading,
          setPatientDetailsLoading,
          isExcerciseBuilderRefresh,
          setIsExcerciseBuilderRefresh,
          isExcerciseBuilderLoading,
          setIsExcerciseBuilderLoading,
          excerciseBuilderPlannerList,
          setExcerciseBuilderPlannerList,
          isExcercisePlanTrackingRefresh,
          setIsExcercisePlanTrackingRefresh,
          isExcercisePlanTrackingLoading,
          setIsExcercisePlanTrackingLoading,
          isExcercisePlanTrackingSessionRefresh,
          setIsExcercisePlanTrackingSessionRefresh
        }}
      >
        <div style={{ backgroundColor: ThemeColorPallate.background }}>
          {/* <DoctorNavBar /> */}
          <Outlet /> {/* Render nested routes here */}
          {/* <Flex direction="column" justify="center" align="center">
          <Text size="9"> Welcome {user.name}!</Text>
          <img src={user.pictureUrl} height={200} width={200}></img>
        </Flex> */}
        </div>
      </CurrentMainScreenContext.Provider>
    </>
  );
};
