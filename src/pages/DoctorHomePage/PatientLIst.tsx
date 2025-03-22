


// DoctorHomePage.tsx
import React, { useEffect, useState } from "react";
import {
  Flex,
  Heading,
  TextField,
  Card,
  Text,
  //   ScrollView,
} from "@radix-ui/themes";
import { getAllPatients } from "../../controllers/PatientsController";
import { iGetAllPatientDto, iPatientDto } from "../../dtos/PatientDto";


export interface PatientListProps {
  // patients: iPatientDto[];
  // setPatients: Dispatch<SetStateAction<iPatientDto[]>>;
  refreshTrigger: boolean;
}

const PatientList: React.FC<PatientListProps> = ({refreshTrigger}) => {
  const [patients, setPatients] = useState([] as iPatientDto[]);

  const [searchTerm, setSearchTerm] = useState("");
  const filteredData: iPatientDto[] = patients.filter((item: iPatientDto) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch data from API
  useEffect(() => {
     getAllPatients({
      data: {},
      afterAPISuccess: (response: iGetAllPatientDto) => {
        setPatients(response.patients);
        console.log(response);
      },
      afterAPIFail: (response) => {
        console.log(response);
      },
    });
  }, [refreshTrigger]);

  return (
    <Flex direction="column" gap="4" p="4" style={{ height: "100%", width:"100%" }}>
      <Heading size="6">Patient List</Heading>

      <TextField.Root
        placeholder="Search patients..."
        value={searchTerm}
        onChange={(e: { target: { value: React.SetStateAction<string> } }) =>
          setSearchTerm(e.target.value)
        }
      ></TextField.Root>

      {/* <ScrollView style={{ maxHeight: '400px' }}> */}
      <Flex direction="column" gap="3">
        {filteredData.map((item: iPatientDto) => (
          <Card key={item.p_id} size="3">
            <Flex direction="column" gap="1">
              <Text size="3" weight="medium">
                {item.name}
              </Text>
              <Text size="2">Age: {item.age}</Text>
              <Text size="2">Condition: {item.chiefComplaint}</Text>
            </Flex>
          </Card>
        ))}
      </Flex>
      {/* </ScrollView> */}
    </Flex>
  );
};

export default PatientList;
