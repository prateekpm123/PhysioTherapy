// DoctorHomePage.tsx
import React, { useEffect, useState } from "react";
import {
  Flex,
  Heading,
  Card,
  Text,
  Skeleton,
} from "@radix-ui/themes";
import { getAllPatients } from "../../../controllers/PatientsController";
import { iGetAllPatientDto, iPatientDto } from "../../../dtos/PatientDto";
import { useSelector } from "react-redux";
import { UserSessionStateType } from "../../../stores/userSessionStore";
import { ReloadIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  DoctorHomeMainScreen,
  useCurrentMainScreenContext,
} from "../DoctorHomePage";
import { useNavigate } from "react-router-dom";
import { DefaultToastTiming, useToast } from "../../../stores/ToastContext";
import { ToastColors } from "../../../components/Toast";
import { styled } from "@stitches/react";
import { themeColors, spacing, theme } from "../../../theme/theme";

interface PatientListProps {
  onCloseMobileMenu?: () => void;
}

const SearchFooter = styled(Flex, {
  padding: spacing.md,
  borderTop: `1px solid ${themeColors.background.elevation2}`,
  backgroundColor: themeColors.background.paper,
  position: "sticky",
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 2,
});

const ListContainer = styled(Flex, {
  height: "100vh",
  backgroundColor: themeColors.background.dark,
  flexDirection: "column",
  position: "relative",
});

const HeaderBar = styled(Flex, {
  padding: spacing.md,
  borderBottom: `1px solid ${themeColors.background.elevation2}`,
  backgroundColor: themeColors.background.paper,
  position: "sticky",
  top: 0,
  zIndex: 2,
});

const SearchInput = styled("div", {
  backgroundColor: themeColors.background.elevation1,
  border: `1px solid ${themeColors.background.elevation3}`,
  borderRadius: "8px",
  padding: `${spacing.xs} ${spacing.sm}`,
  width: "100%",
  transition: "all 0.2s ease",
  color: themeColors.text.primary,
  display: "flex",
  alignItems: "center",
  gap: spacing.sm,
  
  "&:focus-within": {
    boxShadow: `0 0 0 2px ${themeColors.primary[700]}`,
    borderColor: themeColors.primary[500],
  },
});

const StyledInput = styled("input", {
  flex: 1,
  border: "none",
  background: "transparent",
  color: themeColors.text.primary,
  fontSize: "14px",
  outline: "none",
  padding: `${spacing.xs} 0`,

  "&::placeholder": {
    color: themeColors.text.disabled,
  },
});

const PatientCard = styled(Card, {
  cursor: "pointer",
  transition: "all 0.2s ease",
  border: "none",
  backgroundColor: themeColors.background.elevation1,
  margin: `0 ${spacing.md}`,
  padding: spacing.md,
  
  "&:hover": {
    backgroundColor: themeColors.background.elevation2,
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[2],
  },

  "@media (max-width: 768px)": {
    margin: `0 ${spacing.sm}`,
    padding: spacing.sm,
  }
});

const ScrollArea = styled(Flex, {
  flex: 1,
  overflowY: "auto",
  padding: `${spacing.sm} 0`,
  backgroundColor: themeColors.background.dark,
  
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  
  "&::-webkit-scrollbar-track": {
    background: themeColors.background.paper,
  },
  
  "&::-webkit-scrollbar-thumb": {
    background: themeColors.background.elevation3,
    borderRadius: "3px",
    
    "&:hover": {
      background: themeColors.background.elevation2,
    }
  }
});

const HeaderContainer = styled(Flex, {
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  gap: spacing.md,
});

const StyledHeading = styled(Heading, {
  color: themeColors.text.primary,
  fontSize: "1.25rem",
  "@media (max-width: 768px)": {
    fontSize: "1.1rem",
  }
});

const PatientList: React.FC<PatientListProps> = ({ onCloseMobileMenu }) => {
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
    if (onCloseMobileMenu) {
      onCloseMobileMenu();
    }
  };

  useEffect(() => {
    getAllPatients({
      data: { d_id: doctorData.d_id },
      afterAPISuccess: (response: iGetAllPatientDto) => {
        setPatients(response.patients);
        setIsLoading(false);
      },
      afterAPIFail: (response) => {
        showToast(response.message, DefaultToastTiming, ToastColors.RED);
        setIsLoading(false);
      },
    });
  }, [isPatientListScreenRefresh]);

  return (
    <ListContainer>
      <HeaderBar>
        <HeaderContainer>
          <StyledHeading>Patient List</StyledHeading>
          <ReloadIcon
            onClick={onPatientLisRefresh}
            width="20"
            height="20"
            style={{ 
              cursor: "pointer",
              color: themeColors.text.secondary
            }}
          />
        </HeaderContainer>
      </HeaderBar>

      <ScrollArea direction="column" gap="2">
        {isLoading
          ? Array(3)
              .fill(0)
              .map((_, index) => (
                <Skeleton
                  key={index}
                  style={{
                    height: "80px",
                    margin: `0 ${spacing.md}`,
                    marginBottom: spacing.sm,
                  }}
                />
              ))
          : filteredData.map((item: iPatientDto) => (
              <PatientCard key={item.p_id} onClick={() => onPatientCardClick(item)}>
                <Text
                  size="5"
                  weight="bold"
                  style={{ color: themeColors.text.primary }}
                >
                  {item.name}
                </Text>
                <br></br>
                <Text size="2" style={{ color: themeColors.text.secondary }}>
                  Age: {item.age}
                </Text>
                <br></br>
                <Text size="2" style={{ color: themeColors.text.secondary }}>
                  Condition: {item.chiefComplaint}
                </Text>
              </PatientCard>
            ))}
      </ScrollArea>

      <SearchFooter>
        <SearchInput>
          <MagnifyingGlassIcon
            height="16"
            width="16"
            style={{ color: themeColors.text.disabled }}
          />
          <StyledInput
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </SearchInput>
      </SearchFooter>
    </ListContainer>
  );
};

export default PatientList;
