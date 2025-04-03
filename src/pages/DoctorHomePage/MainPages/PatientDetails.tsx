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
  Skeleton,
  ScrollArea,
} from "@radix-ui/themes";
import { styled } from "@stitches/react";
import { themeColors, spacing } from "../../../theme/theme";
// import { Link } from "@radix-ui/themes";
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

const PageContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  backgroundColor: themeColors.background.dark,
});

const FixedHeader = styled("div", {
  padding: spacing.lg,
  backgroundColor: themeColors.background.dark,
  borderBottom: `1px solid ${themeColors.background.elevation2}`,
});

const ScrollableContent = styled(ScrollArea, {
  flex: 1,
  padding: spacing.lg,
  paddingTop: 0,
});

const ExercisePlanCard = styled(Card, {
  width: "100%",
  backgroundColor: themeColors.background.elevation1,
  marginBottom: spacing.md,

  "@media (max-width: 768px)": {
    padding: spacing.sm,
  },
});

const ExerciseTitle = styled(Text, {
  fontSize: "1rem",
  fontWeight: "bold",
  color: themeColors.text.primary,
  marginBottom: spacing.xs,

  "@media (max-width: 768px)": {
    fontSize: "0.9rem",
  },
});

const StyledButton = styled(Button, {
  "@media (max-width: 768px)": {
    width: "100%",
    marginTop: spacing.sm,
  },
});

const ExercisePlanHeader = styled(Flex, {
  padding: "0px 24px",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  marginBottom: spacing.md,
  paddingTop: spacing.lg,

  "@media (max-width: 768px)": {
    flexDirection: "column",
    alignItems: "stretch",
    gap: spacing.sm,
  },
});

const PatientInfoCard = styled(Card, {
  backgroundColor: themeColors.background.elevation1,
  marginBottom: spacing.lg,
});

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

  const onExcercisePlanOpenClick = (epid: string) => {
    // Set breadcrumbs for Exercise Plan page
    setBreadCrumbItems([
      {
        label: "Patient Details",
        onClick: () => {
          navigate("/doctorhome/main/patientDetails/" + pid);
        },
      },
      {
        label: "Exercise Plan",
      },
    ]);

    navigate(
      "/doctorhome/main/patientDetails/" + pid + "/excercisePlans/" + epid
    );
  };

  return (
    <PageContainer>
      <Outlet />

      <FixedHeader>
        {/* Patient Header */}
        <Flex direction="column" gap="4">
          <Flex direction="row" justify="between" mb="4">
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
          <PatientInfoCard>
            <Text style={{ color: "gray" }}>Chief Complaint</Text>
            <Skeleton loading={patientDetailsLoading}>
              <Heading size="7">
                {currentPatientDetails?.chiefComplaint}
              </Heading>
            </Skeleton>
            <Skeleton loading={patientDetailsLoading}>
              <Text style={{ listStyleType: "disc" }}>
                {currentPatientDetails?.description}
              </Text>
            </Skeleton>
          </PatientInfoCard>
        </Flex>
      </FixedHeader>
      <ExercisePlanHeader>
        <Heading size="6">Exercise Plans</Heading>
        <StyledButton onClick={onCreateNewPlan}>Create a new plan</StyledButton>
      </ExercisePlanHeader>
      <ScrollableContent>
        {/* Exercise Plans */}
        <Flex direction="column" gap="4">
          {currentPatientDetails?.excercisePlans?.map((plan) => (
            <ExercisePlanCard key={plan.ep_id}>
              <Flex direction="column" gap="2">
                <ExerciseTitle>
                  Exercise Plan: Date{" "}
                  {plan.date_created.toString().slice(0, 10)}
                </ExerciseTitle>
                {plan.excercise.map((exercise) => (
                  <Skeleton key={exercise.e_id} loading={patientDetailsLoading}>
                    <Card mt="2">
                      <Text size="2">{exercise.excercise_name}</Text>
                      <Flex>
                        <Text>
                          <b>Description:</b> {exercise.excercise_description}
                        </Text>
                      </Flex>
                      <Flex gap="2">
                        <Text>
                          <b>Sets:</b> {exercise.excercise_sets}
                        </Text>
                        <Text>
                          <b>Reps:</b> {exercise.excercise_reps}
                        </Text>
                      </Flex>
                    </Card>
                  </Skeleton>
                ))}
                <StyledButton
                  variant="outline"
                  onClick={() => onExcercisePlanOpenClick(plan.ep_id)}
                >
                  Open plan
                </StyledButton>
              </Flex>
            </ExercisePlanCard>
          ))}
        </Flex>
      </ScrollableContent>
    </PageContainer>
  );
};

export default PatientDetails;
