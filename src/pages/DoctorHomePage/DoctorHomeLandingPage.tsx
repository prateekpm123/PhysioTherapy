import { Flex } from "@radix-ui/themes";
import PatientList from "./PatientLIst";
import NewPatientEntry from "./NewPatientEntry";
import ThemeColorPallate from "../../assets/ThemeColorPallate";
import PatientDetails from "./PatientDetails";
import { DoctorHomeMainScreen, useCurrentMainScreenContext } from "./DoctorHomePage";
// import { iPatientDto } from "../../dtos/PatientDto";
// import { iPatientDto } from "../../dtos/PatientDto";
// import { useState } from "react";

interface iDoctorHomeLandingPage {
  onSave: () => void;
  // patients: iPatientDto[];
  // setPatients: React.Dispatch<React.SetStateAction<iPatientDto[]>>;
  refreshTrigger: boolean;
  setPatientListRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}



const DoctorHomeLandingPage: React.FC<iDoctorHomeLandingPage> = ( {onSave, refreshTrigger, setPatientListRefresh} ) => {
  const { currentMainScreen } = useCurrentMainScreenContext();
  const renderComponent = () => {
    if (currentMainScreen === DoctorHomeMainScreen.NEW_PATIENT_ENTRY) {
      return <NewPatientEntry onSave={onSave} />;
    } else if (currentMainScreen === DoctorHomeMainScreen.PATIENT_DETAILS) {
      return <PatientDetails />;
    } else {
      return <div>Please log in.</div>;
    }
  };

  

  const component = renderComponent();
  
  return (
    <>
      <div>
        <Flex
          direction="row"
          justify="start"
          align="stretch"
          style={{ display: "flex" }}
        >
          <Flex style={{ flex: 2, boxShadow:"9px 0px 18px 4px rgba(0,0,0,0.75)", backgroundColor: ThemeColorPallate.foreground }}>
            <PatientList refreshTrigger={refreshTrigger} setPatientListRefresh={setPatientListRefresh}></PatientList>
          </Flex>
          <Flex style={{ flex: 5 }}>
              {component}
          </Flex>
        </Flex>
      </div>
    </>
  );
};

export default DoctorHomeLandingPage;
