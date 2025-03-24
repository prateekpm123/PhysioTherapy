import { Flex } from "@radix-ui/themes";
import PatientList from "./PatientLIst";
import NewPatientEntry from "./NewPatientEntry";
import ThemeColorPallate from "../../assets/ThemeColorPallate";
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
            <NewPatientEntry onSave={onSave}></NewPatientEntry>
          </Flex>
        </Flex>
      </div>
    </>
  );
};

export default DoctorHomeLandingPage;
