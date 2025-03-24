// DoctorHomePage.tsx
import React, { useEffect, useState } from "react";
import {
  Flex,
  Heading,
  TextField,
  Card,
  Text,
  Skeleton,
  //   ScrollView,
} from "@radix-ui/themes";
import { getAllPatients } from "../../controllers/PatientsController";
import { iGetAllPatientDto, iPatientDto } from "../../dtos/PatientDto";
import { useSelector } from "react-redux";
import { UserSessionStateType } from "../../stores/userSessionStore";
import { ReloadIcon } from "@radix-ui/react-icons";
import ErrorHandler from "../../errorHandlers/ErrorHandler";
import { DoctorHomeMainScreen, useCurrentMainScreenContext } from "./DoctorHomePage";

export interface PatientListProps {
  // patients: iPatientDto[];
  // setPatients: Dispatch<SetStateAction<iPatientDto[]>>;
  setPatientListRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refreshTrigger: boolean;
}

const PatientList: React.FC<PatientListProps> = ({
  refreshTrigger,
  setPatientListRefresh,
}) => {
  const [patients, setPatients] = useState([] as iPatientDto[]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { setCurrentMainScreen, setCurrentPatientId } = useCurrentMainScreenContext();
  const filteredData: iPatientDto[] = patients.filter((item: iPatientDto) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const doctorData = useSelector(
    (state: UserSessionStateType) => state.userSession.doctorDetails
  );

  const onPatientLisRefresh = () => {
    setPatientListRefresh(!refreshTrigger);
    setIsLoading(true);
  };

  const onPatientCardClick = (patientData: iPatientDto) => {
    setCurrentMainScreen(DoctorHomeMainScreen.PATIENT_DETAILS)
    if (setCurrentPatientId) {
      setCurrentPatientId(patientData);
    }
  };

  // Fetch data from API
  useEffect(() => {
    getAllPatients({
      data: { d_id: doctorData.d_id },
      afterAPISuccess: (response: iGetAllPatientDto) => {
        setPatients(response.patients);
        setIsLoading(false);
        console.log(response);
      },
      afterAPIFail: (response) => {
        ErrorHandler(response);
        setIsLoading(false);
        console.log(response);
      },
    });
  }, [refreshTrigger]);

  return (
    <Flex
      direction="column"
      gap="4"
      p="4"
      style={{ height: "100%", width: "100%" }}
    >
      <Flex direction="row" gap="4" p="4" align="stretch" justify="start">
        <Heading size="6">Patient List</Heading>
        <ReloadIcon onClick={onPatientLisRefresh} />
      </Flex>

      <TextField.Root
        placeholder="Search patients..."
        value={searchTerm}
        onChange={(e: { target: { value: React.SetStateAction<string> } }) =>
          setSearchTerm(e.target.value)
        }
      ></TextField.Root>

      {/* <ScrollView style={{ maxHeight: '400px' }}> */}
      <Flex direction="column" gap="3" height="78vh" overflow="auto">
        {filteredData.map((item: iPatientDto) => (
          <Skeleton loading={isLoading}>
            <Card
              onClick={()=>onPatientCardClick(item)}
              key={item.d_id}
              size="3"
              style={{ minHeight: "120px" }}
            >
              <Flex direction="column" gap="1">
                <Text size="3" weight="medium">
                  {item.name}
                </Text>
                <Text size="2">Age: {item.age}</Text>
                <Text size="2">Condition: {item.chiefComplaint}</Text>
              </Flex>
            </Card>
          </Skeleton>
        ))}
      </Flex>
      {/* </ScrollView> */}
    </Flex>
  );
};

export default PatientList;
