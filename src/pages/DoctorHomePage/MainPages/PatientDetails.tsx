import {
  DoctorHomeMainScreen,
  useCurrentMainScreenContext,
} from "../DoctorHomePage";
import {
  Flex,
  Heading,
  Text,
  Button,
  Card,
  Grid,
  Skeleton,
  ScrollArea,
} from "@radix-ui/themes";
// import { Link } from "@radix-ui/themes";
// import { styled } from "@stitches/react";
// import { useNavigate } from "react-router-dom";
// import ThemeColorPallate from "../../assets/ThemeColorPallate";
// import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";
import { findPatient } from "../../../controllers/PatientsController";
import { iPatientDto } from "../../../dtos/PatientDto";
import { getExcercisePlans } from "../../../controllers/ExcerciseController";
import { iExcercisePlanDto } from "../../../models/ExcerciseInterface";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { DefaultToastTiming, useToast } from "../../../stores/ToastContext";
import { ToastColors } from "../../../components/Toast";

const PatientDetails = () => {
  const {
    currentPatientDetails,
    setCurrentPatientDetails,
    setBreadCrumbItems,
    isPatientDetailsScreenRefresh,
    setCurrentMainScreen,
    setPatientDetailsLoading,
    patientDetailsLoading,
  } = useCurrentMainScreenContext();

  const navigate = useNavigate();
  const { pid } = useParams();
  const { showToast } = useToast();
  const onCreateNewPlan = () => {
    // navigate("/doctorhome/main/buildPlan");
    navigate(
      "/doctorhome/main/patientDetails/" +
        currentPatientDetails?.p_id +
        "/buildPlan"
    );
    setBreadCrumbItems([
      {
        label: "Patient Details",
        onClick: () => {
          setCurrentMainScreen(DoctorHomeMainScreen.PATIENT_DETAILS);
          navigate(
            "/doctorhome/main/patientDetails/" + currentPatientDetails?.p_id
          );
          setBreadCrumbItems([
            // setting the breadcrumb again here, so that Excercise Builder gets removed
            {
              label: "Patient Details",
              onClick: () => {
                navigate(
                  "/doctorhome/main/patientDetails/" +
                    currentPatientDetails?.p_id
                );
                // setCurrentMainScreen(DoctorHomeMainScreen.PATIENT_DETAILS);
              },
            },
          ]);
        },
      },
      {
        label: "Exercise Builder",
        onClick: () => {
          navigate(
            "/doctorhome/main/patientDetails/" +
              currentPatientDetails?.p_id +
              "/buildPlan"
          );
          setCurrentMainScreen(DoctorHomeMainScreen.EXCERCISE_BUILDER);
        },
      },
    ]);
    // setCurrentMainScreen(DoctorHomeMainScreen.EXCERCISE_BUILDER);
  };

  // Fetch data from API
  useEffect(() => {
    setPatientDetailsLoading(true);
    async function refreshPatientDetails() {
      await findPatient({
        data: {
          p_id: pid,
        },
        afterAPISuccess: (response) => {
          const patient: iPatientDto = response.patient;
          if (setCurrentPatientDetails) {
            setCurrentPatientDetails(patient);
          }
          setPatientDetailsLoading(false);
          console.log(response);
        },
        afterAPIFail: (response) => {
          showToast(response.message, DefaultToastTiming, ToastColors.RED);
          // ErrorHandler(response);
          setPatientDetailsLoading(false);
          console.log(response);
        },
      }).then(() => {
        getExcercisePlans({
          data: {
            p_id: pid,
          },
          afterAPISuccess: (res) => {
            const temp = res.excercisePlans as iExcercisePlanDto[];
            const temp2 = currentPatientDetails;
            if (temp2 && setCurrentPatientDetails) {
              temp2.excercisePlans = temp;
              setCurrentPatientDetails(temp2);
            }
            setPatientDetailsLoading(false);
            console.log(res);
          },
          afterAPIFail(res) {
            setPatientDetailsLoading(false);
            console.log(res);
          },
        });
      });
    }
    refreshPatientDetails();
  }, [isPatientDetailsScreenRefresh]);

  const onExcercisePlanOpenClick = (epid: string)=>{
    navigate("/doctorhome/main/patientDetails/"+pid+"/excercisePlans/"+epid);
  }

  return (
    <ScrollArea style={{ height: "80vh" }}>
      <Outlet></Outlet>
      <Flex direction="column" gap="4" p="4" width="100%">
        {/* Patient Header */}
        <Flex direction="row" justify="between">
          <Skeleton loading={patientDetailsLoading}>
            <Heading size="7">{currentPatientDetails?.name}</Heading>
          </Skeleton>
          <Flex direction="column" align="stretch" gap="2">
            <Skeleton loading={patientDetailsLoading}>
              <Flex direction="row" align="stretch" gap="2">
                <Text>Age: </Text>
                <Text>{currentPatientDetails?.age}</Text>
              </Flex>
            </Skeleton>
            <Skeleton loading={patientDetailsLoading}>
              <Flex direction="row" align="stretch" gap="2">
                <Text>Number: </Text>
                <Text>{currentPatientDetails?.phone_number}</Text>
              </Flex>
            </Skeleton>
            <Skeleton loading={patientDetailsLoading}>
              <Flex direction="row" align="stretch" gap="2">
                <Text>Email: </Text>
                <Text>{currentPatientDetails?.email}</Text>
              </Flex>
            </Skeleton>
          </Flex>
          <Flex direction="column" align="stretch" gap="2">
            <Skeleton loading={patientDetailsLoading}>
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

          <Skeleton loading={patientDetailsLoading}>
            <Heading size="7">{currentPatientDetails?.chiefComplaint}</Heading>
          </Skeleton>
          <Skeleton loading={patientDetailsLoading}>
            <Text style={{ listStyleType: "disc" }}>
              {currentPatientDetails?.description}
            </Text>
          </Skeleton>
        </Card>

        {/* Exercise Plans */}
        <Flex direction="column" gap="2">
          <Flex direction="row" justify="between" align="center">
            <Heading size="5">Exercise Plans</Heading>
            <Button onClick={onCreateNewPlan} variant="soft">
              Create a new plan
            </Button>
          </Flex>

          {/* Placeholder for Exercise Plan Cards */}
          <Grid rows="5" gap="3">
            {currentPatientDetails?.excercisePlans &&
              currentPatientDetails?.excercisePlans.map((plan) => (
                <Card key={plan.ep_id} mt="4">
                  <Skeleton loading={patientDetailsLoading}>
                    <Flex direction="row">
                      <Heading size="3" mb="2" style={{marginRight: "55rem"}}>
                        Exercise Plan: Date{" "}
                        {plan.date_created.toString().slice(0, 10)}
                      </Heading>
                      <Button variant="outline" onClick={() => onExcercisePlanOpenClick(plan.ep_id)}>Open plan</Button>
                    </Flex>
                  </Skeleton>
                  {plan.excercise.map((exercise) => (
                    <Skeleton loading={patientDetailsLoading}>
                      <Card key={exercise.e_id} mt="2">
                        <Heading size="2">{exercise.excercise_name}</Heading>
                        <Text>
                          <b>Description:</b>{" "}
                          {exercise.excercise_description + "  "}
                        </Text>
                        <Text>
                          <b>Sets:</b> {exercise.excercise_sets}{" "}
                          {exercise.excercise_sets_description + "  "}
                        </Text>
                        <Text>
                          <b>Reps:</b> {exercise.excercise_reps}{" "}
                          {exercise.excercise_reps_description}
                        </Text>
                      </Card>
                    </Skeleton>
                  ))}
                </Card>
              ))}
            <Flex align="center" justify="center"></Flex>
          </Grid>
        </Flex>
      </Flex>
    </ScrollArea>
  );
};

export default PatientDetails;
