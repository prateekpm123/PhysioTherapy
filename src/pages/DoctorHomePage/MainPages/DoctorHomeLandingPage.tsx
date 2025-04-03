/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { Box, Button } from "@radix-ui/themes";
import PatientList from "./PatientLIst";
import { useCurrentMainScreenContext } from "../DoctorHomePage";
import { ReloadIcon, HamburgerMenuIcon, Cross1Icon } from "@radix-ui/react-icons";
import { styled } from "@stitches/react";
import CustomBreadcrumb from "./DoctorMiniNavBarBreadCrumb";
import { Outlet, useMatch, Link, useNavigate } from "react-router-dom";
import { themeColors, spacing, theme } from "../../../theme/theme";
import DoctorNavBar from "../DoctorNavBar";

const AppContainer = styled("div", {
  height: "100vh",
  backgroundColor: themeColors.background.dark,
  display: "flex",
  overflow: "hidden", // Prevent scrolling on the main container
});

const Sidebar = styled("aside", {
  backgroundColor: themeColors.background.paper,
  boxShadow: theme.shadows[3],
  width: "320px",
  transition: "transform 0.3s ease",
  position: "relative",
  zIndex: 20,
  display: "flex",
  flexDirection: "column",

  "@media (max-width: 768px)": {
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    transform: "translateX(-100%)",
    
    "&.open": {
      transform: "translateX(0)",
    }
  }
});

const MainContent = styled("main", {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  position: "relative",
  backgroundColor: themeColors.background.dark,
  height: "100vh",
  overflow: "hidden",
});

const TopBar = styled("header", {
  padding: spacing.md,
  backgroundColor: themeColors.background.paper,
  boxShadow: theme.shadows[1],
  display: "flex",
  alignItems: "center",
  gap: spacing.md,
  height: "64px",
  minHeight: "64px",
});

const Logo = styled(Link, {
  fontSize: "1.5rem",
  fontWeight: "600",
  color: themeColors.text.primary,
  textDecoration: "none",
  marginRight: spacing.lg,

  "@media (max-width: 768px)": {
    fontSize: "1.25rem",
  }
});

const BreadcrumbContainer = styled(Box, {
  flex: 1,
  display: "flex",
  alignItems: "center",
  gap: spacing.sm,
  minWidth: 0,
});

const ActionContainer = styled(Box, {
  display: "flex",
  alignItems: "center",
  gap: spacing.md,
});

const MenuButton = styled("button", {
  display: "none",
  background: "none",
  border: "none",
  padding: spacing.sm,
  cursor: "pointer",
  color: themeColors.text.primary,
  
  "@media (max-width: 768px)": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  "&:hover": {
    backgroundColor: themeColors.background.elevation2,
    borderRadius: theme.radius[2],
  }
});

const Overlay = styled("div", {
  display: "none",
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  backdropFilter: "blur(4px)",
  zIndex: 15,

  "@media (max-width: 768px)": {
    "&.open": {
      display: "block",
    }
  }
});

const ContentArea = styled("div", {
  flex: 1,
  overflow: "auto",
  backgroundColor: themeColors.background.dark,
  position: "relative",
});

const DoctorHomeLandingPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { 
    breadCrumbItems, 
    isExcerciseBuilderRefresh, 
    setIsExcerciseBuilderRefresh,
    setIsPatientDetailScreenRefresh,
    isPatientDetailsScreenRefresh,
    isExcercisePlanTrackingRefresh,
    setIsExcercisePlanTrackingRefresh,
    isExcercisePlanTrackingSessionRefresh,
    setIsExcercisePlanTrackingSessionRefresh,
    setCurrentMainScreen,
    setBreadCrumbItems
  } = useCurrentMainScreenContext();

  const isExcerciseBuilder = useMatch("/doctorhome/main/patientDetails/:pid/buildPlan");
  const isPatientDetails = useMatch("/doctorhome/main/patientDetails/:pid");
  const isExcercisePlanTracking = useMatch("/doctorhome/main/patientDetails/:pid/excercisePlans/:epid");
  const isExcercisePlanTrackingSession = useMatch("/doctorhome/main/patientDetails/:pid/excercisePlans/:epid/trackSession");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onMiniNavBarReloadClick = () => {
    if (isPatientDetails) {
      setIsPatientDetailScreenRefresh(!isPatientDetailsScreenRefresh);
    } else if (isExcerciseBuilder) {
      setIsExcerciseBuilderRefresh(!isExcerciseBuilderRefresh);
    } else if (isExcercisePlanTracking) {
      setIsExcercisePlanTrackingRefresh(!isExcercisePlanTrackingRefresh);
    } else if (isExcercisePlanTrackingSession) {
      setIsExcercisePlanTrackingSessionRefresh(!isExcercisePlanTrackingSessionRefresh);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const onClickNewPatient = () => {
    setBreadCrumbItems([{ label: "", onClick: () => {} }]);
    navigate('/doctorhome/main/newPatient');
    setCurrentMainScreen(1); // NEW_PATIENT_ENTRY
  };

  return (
    <AppContainer>
      <Sidebar className={isMobileMenuOpen ? "open" : ""}>
        <PatientList onCloseMobileMenu={() => setIsMobileMenuOpen(false)} />
      </Sidebar>

      <Overlay 
        className={isMobileMenuOpen ? "open" : ""} 
        onClick={() => setIsMobileMenuOpen(false)} 
      />

      <MainContent>
        <TopBar>
          <MenuButton onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? (
              <Cross1Icon style={{ color: themeColors.text.primary }} />
            ) : (
              <HamburgerMenuIcon style={{ color: themeColors.text.primary }} />
            )}
          </MenuButton>

          <Logo to="/doctorhome">PhysioCare</Logo>

          <BreadcrumbContainer>
            <CustomBreadcrumb items={breadCrumbItems} />
          </BreadcrumbContainer>

          <ActionContainer>
            <Button onClick={onClickNewPatient} variant="soft">
              Create New Patient
            </Button>

            <ReloadIcon
              onClick={onMiniNavBarReloadClick}
              width="24"
              height="24"
              style={{ 
                cursor: "pointer",
                color: themeColors.text.secondary,
              }}
            />

            <DoctorNavBar />
          </ActionContainer>
        </TopBar>

        <ContentArea>
          <Outlet />
        </ContentArea>
      </MainContent>
    </AppContainer>
  );
};

export default DoctorHomeLandingPage;
