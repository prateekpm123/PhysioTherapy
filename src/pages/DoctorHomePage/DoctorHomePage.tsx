import { useSelector } from "react-redux";
import { UserSessionStateType } from "../../stores/userSessionStore";
import { useNavigate } from "react-router-dom";
// import { User } from "../../models/IUser";
import DoctorNavBar from "./DoctorNavBar";
// import { Flex, Text } from "@radix-ui/themes";
import { Outlet } from "react-router-dom";
import ThemeColorPallate from "../../assets/ThemeColorPallate";
import { createContext, useContext, useState } from "react";
import { iPatientDto } from "../../dtos/PatientDto";
// import { iPatientDto } from "../../dtos/PatientDto";

export enum DoctorHomeMainScreen {
  NEW_PATIENT_ENTRY = 1,
  PATIENT_DETAILS = 2,
}

interface DoctorContext {
  currentMainScreen: DoctorHomeMainScreen;
  setCurrentMainScreen: React.Dispatch<
    React.SetStateAction<DoctorHomeMainScreen>
  >;
  currentPatientDetails?: iPatientDto;
  setCurrentPatientDetails?: React.Dispatch<React.SetStateAction<iPatientDto>>;
  isPatientDetailsScreenRefresh: boolean;
  setIsPatientDetailScreenRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create a context for the state variable
const CurrentMainScreenContext = createContext<DoctorContext | undefined>(undefined);

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

  const [currentMainScreen, setCurrentMainScreen] = useState(
    DoctorHomeMainScreen.NEW_PATIENT_ENTRY
  );

  const [currentPatientDetails, setCurrentPatientDetails] = useState(
    {} as iPatientDto
  );

  const [isPatientDetailsScreenRefresh, setIsPatientDetailScreenRefresh] = useState(false);

  // const user: User = useSelector(
  // (state: UserSessionStateType) => state.userSession.user
  // );
  const navigate = useNavigate();
  if (!isSignedIn) {
    navigate("/signin");
    return;
  }
  return (
    <>
      <CurrentMainScreenContext.Provider
        value={{
          currentMainScreen,
          setCurrentMainScreen,
          currentPatientDetails,
          setCurrentPatientDetails,
          isPatientDetailsScreenRefresh, 
          setIsPatientDetailScreenRefresh
        }}
      >
        <div style={{ backgroundColor: ThemeColorPallate.background }}>
          <DoctorNavBar />
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
