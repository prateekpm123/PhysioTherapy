import { useCurrentMainScreenContext } from "./DoctorHomePage";
import {
  Flex,
  Heading,
  Text,
  Button,
  Card,
  Grid,
  Skeleton,
} from "@radix-ui/themes";
// import { Link } from "@radix-ui/themes";
import { styled } from "@stitches/react";
// import { useNavigate } from "react-router-dom";
import ThemeColorPallate from "../../assets/ThemeColorPallate";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { findPatient } from "../../controllers/PatientsController";
import { iPatientDto } from "../../dtos/PatientDto";
import ErrorHandler from "../../errorHandlers/ErrorHandler";

const Nav = styled("nav", {
  padding: "1rem 0",
  borderBottom: "1px solid $gray6",
  position: "sticky",
  top: 0,
  backgroundColor: "$background",
  zIndex: 10,
  display: "block",
});

const PatientDetails = () => {
  const {
    currentPatientDetails,
    setCurrentPatientDetails,
    isPatientDetailsScreenRefresh,
    setIsPatientDetailScreenRefresh,
  } = useCurrentMainScreenContext();
  //   const navigate = useNavigate();
  const [loading, setIsLoading] = useState(false);
  const onPatientDetailsRefresh = () => {
    setIsLoading(true);
    setIsPatientDetailScreenRefresh(!isPatientDetailsScreenRefresh);
  };

  // Fetch data from API
  useEffect(() => {
    findPatient({
      data: currentPatientDetails,
      afterAPISuccess: (response) => {
        const patient: iPatientDto = response.patient;
        if (setCurrentPatientDetails) {
          setCurrentPatientDetails(patient);
        }
        setIsLoading(false);
        console.log(response);
      },
      afterAPIFail: (response) => {
        ErrorHandler(response);
        setIsLoading(false);
        console.log(response);
      },
    });
  }, [isPatientDetailsScreenRefresh]);
  return (
    <Flex direction="column" gap="4" p="4" width="100%">
      {/* Patient Header */}
      <Nav style={{ backgroundColor: ThemeColorPallate.foreground }}>
        <div style={{ width: "100%", padding: "0 1rem" }}>
          <Flex
            justify="between"
            align="center"
            style={{ width: "100%" }}
            gap="4"
          >
            <Flex style={{ justifyContent: "center" }}>
              {/* <Link onClick={()=> navigate('/doctorhome')} href="#" style={{color: "white"}} >Home Center</Link> */}
            </Flex>
            <Flex
              style={{ justifyContent: "flex-end", marginRight: "1rem" }}
            ></Flex>
            <ReloadIcon
              onClick={onPatientDetailsRefresh}
              width="28" // Adjust size as needed
              height="28" // Adjust size as needed
            />
          </Flex>
        </div>
      </Nav>
      <Flex direction="row" justify="between">
        <Skeleton loading={loading}>
          <Heading size="7">{currentPatientDetails?.name}</Heading>
        </Skeleton>
        <Flex direction="column" align="stretch" gap="2">
          <Skeleton loading={loading}>
            <Flex direction="row" align="stretch" gap="2">
              <Text>Age: </Text>
              <Text>{currentPatientDetails?.age}</Text>
            </Flex>
          </Skeleton>
          <Skeleton loading={loading}>
            <Flex direction="row" align="stretch" gap="2">
              <Text>Number: </Text>
              <Text>{currentPatientDetails?.phone_number}</Text>
            </Flex>
          </Skeleton>
          <Skeleton loading={loading}>
            <Flex direction="row" align="stretch" gap="2">
              <Text>Email: </Text>
              <Text>{currentPatientDetails?.email}</Text>
            </Flex>
          </Skeleton>
        </Flex>
        <Flex direction="column" align="stretch" gap="2">
          <Skeleton loading={loading}>
            <Flex direction="row" align="stretch" gap="2" maxWidth="500px">
              <Text>Address: </Text>
              <Text>{currentPatientDetails?.address}</Text>
            </Flex>
          </Skeleton>
        </Flex>
      </Flex>

      {/* Chief Complaint */}
      <Card>
        <Text style={{ color: "gray" }}>Chief Complaint</Text>

        <Skeleton loading={loading}>
          <Heading size="7">{currentPatientDetails?.chiefComplaint}</Heading>
        </Skeleton>
        <Skeleton loading={loading}>
          <Text style={{ listStyleType: "disc" }}>
            {currentPatientDetails?.description}
          </Text>
        </Skeleton>
      </Card>

      {/* Exercise Plans */}
      <Flex direction="column" gap="2">
        <Flex direction="row" justify="between" align="center">
          <Heading size="5">Exercise Plans</Heading>
          <Button variant="soft">Create a new plan</Button>
        </Flex>

        {/* Placeholder for Exercise Plan Cards */}
        <Grid columns="5" gap="3">
          {[1, 2, 3, 4, 5].map((index) => (
            <Card
              key={index}
              style={{ height: "150px", backgroundColor: "#f0f0f0" }}
            >
              {/* Placeholder content or image */}
            </Card>
          ))}
          <Flex align="center" justify="center"></Flex>
        </Grid>
      </Flex>
    </Flex>
  );
};

export default PatientDetails;
