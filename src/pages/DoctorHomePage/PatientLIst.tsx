// import {  useState } from 'react';
// import { Theme, Container, Heading, TextField, List, ListItem, Text } from '@radix-ui/themes';

// const PatientList = () => {
//   const [searchTerm, setSearchTerm] = useState('');

//   // Dummy data for patients
//   const patients = [
//     { id: 1, name: 'John Doe', age: 32, condition: 'Back Pain' },
//     { id: 2, name: 'Jane Smith', age: 45, condition: 'Neck Stiffness' },
//     { id: 3, name: 'Mike Johnson', age: 28, condition: 'Knee Injury' },
//     { id: 4, name: 'Emily Brown', age: 51, condition: 'Shoulder Impingement' },
//   ];

//   // Filter patients based on search term
//   const filteredPatients = patients.filter(patient =>
//     patient.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <Theme appearance="light" accentColor="blue">
//       <Container>
//         {/* Heading */}
//         <Heading as="h1" size="4" className="mb-4">
//           Patient List
//         </Heading>

//         {/* Search Input */}
//         <TextField.Root className="mb-6">
//           <TextField.Slot>
//             <span role="img" aria-label="search">🔍</span>
//           </TextField.Slot>
//           <TextField
//             placeholder="Search patients..."
//             value={searchTerm}
//             onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
//           />
//         </TextField.Root>

//         {/* Patient List */}
//         <List>
//           {filteredPatients.length > 0 ? (
//             filteredPatients.map(patient => (
//               <ListItem key={patient.id} className="mb-2">
//                 <Text size="2">
//                   <strong>{patient.name}</strong> - Age: {patient.age}, Condition: {patient.condition}
//                 </Text>
//               </ListItem>
//             ))
//           ) : (
//             <Text size="2" className="text-gray-500">
//               No patients found.
//             </Text>
//           )}
//         </List>
//       </Container>
//     </Theme>
//   );
// };

// export default PatientList;

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

const PatientList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([] as iPatientDto[]);
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
  }, []);

  return (
    <Flex direction="column" gap="4" p="4">
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
