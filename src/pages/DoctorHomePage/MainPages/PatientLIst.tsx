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
import { getAllPatients } from "../../../controllers/PatientsController";
import { iGetAllPatientDto, iPatientDto } from "../../../dtos/PatientDto";
import { useSelector } from "react-redux";
import { UserSessionStateType } from "../../../stores/userSessionStore";
import { ReloadIcon } from "@radix-ui/react-icons";
// import ErrorHandler from "../../../errorHandlers/ErrorHandler";
import {
  DoctorHomeMainScreen,
  useCurrentMainScreenContext,
} from "../DoctorHomePage";
import { useNavigate } from "react-router-dom";
import { DefaultToastTiming, useToast } from "../../../stores/ToastContext";
import { ToastColors } from "../../../components/Toast";

export interface PatientListProps {
  // patients: iPatientDto[];
  // setPatients: Dispatch<SetStateAction<iPatientDto[]>>;
  setPatientListRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refreshTrigger: boolean;
}

const PatientList = () => {
  const [patients, setPatients] = useState([] as iPatientDto[]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const {
    setBreadCrumbItems,
    setCurrentMainScreen,
    setCurrentPatientDetails,
    isPatientListScreenRefresh,
    setIsPatientListScreenRefresh,
    isPatientDetailsScreenRefresh,
    setIsPatientDetailScreenRefresh,
  } = useCurrentMainScreenContext();
  const filteredData: iPatientDto[] = patients.filter((item: iPatientDto) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { showToast } = useToast();
  const doctorData = useSelector(
    (state: UserSessionStateType) => state.userSession.doctorDetails
  );

  const onPatientLisRefresh = () => {
    setIsPatientListScreenRefresh(!isPatientListScreenRefresh);
    setIsLoading(true);
  };

  const onPatientCardClick = (patientData: iPatientDto) => {
    navigate("/doctorhome/main/patientDetails/" + patientData.p_id);
    setCurrentMainScreen(DoctorHomeMainScreen.PATIENT_DETAILS);
    setIsPatientDetailScreenRefresh(!isPatientDetailsScreenRefresh);
    setBreadCrumbItems([
      {
        label: "Patient Details",
        onClick: () => {
          setCurrentMainScreen(DoctorHomeMainScreen.PATIENT_DETAILS);
          navigate("/doctorhome/main/patientDetails/" + patientData.p_id);
        },
      },
    ]);
    if (setCurrentPatientDetails) {
      setCurrentPatientDetails(patientData);
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
        showToast(response.message, DefaultToastTiming, ToastColors.RED);

        // ErrorHandler(response);
        setIsLoading(false);
        console.log(response);
      },
    });
  }, [isPatientListScreenRefresh]);

  return (
    <Flex
      direction="column"
      gap="4"
      p="4"
      style={{ height: "100%", width: "100%" }}
    >
      <Flex direction="row" gap="4" p="4" align="center" justify="between">
        <Heading size="6">Patient List</Heading>
        <ReloadIcon
          onClick={onPatientLisRefresh}
          width="28" // Adjust size as needed
          height="28" // Adjust size as needed
        />
      </Flex>

      <TextField.Root
        placeholder="Search patients..."
        value={searchTerm}
        onChange={(e: { target: { value: React.SetStateAction<string> } }) =>
          setSearchTerm(e.target.value)
        }
      ></TextField.Root>

      {/* <ScrollView style={{ maxHeight: '400px' }}> */}
      <Flex direction="column" gap="3" height="78dvh" overflow="auto">
        {filteredData.map((item: iPatientDto) => (
          <Skeleton loading={isLoading}>
            <Card
              onClick={() => onPatientCardClick(item)}
              key={item.p_id}
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
