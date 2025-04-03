/* eslint-disable @typescript-eslint/no-unused-vars */
import { Flex } from "@radix-ui/themes";
import PatientList from "./PatientLIst";
import ThemeColorPallate from "../../../assets/ThemeColorPallate";
import {
  useCurrentMainScreenContext,
} from "../DoctorHomePage";
import { ReloadIcon } from "@radix-ui/react-icons";
import { styled } from "@stitches/react";
import CustomBreadcrumb from "./DoctorMiniNavBarBreadCrumb";
import { Outlet, useMatch } from "react-router-dom";

const Nav = styled("nav", {
  padding: "1rem 0",
  borderBottom: "1px solid $gray6",
  position: "sticky",
  top: 0,
  backgroundColor: "$background",
  zIndex: 10,
  display: "block",
});

const DoctorHomeLandingPage = () => {
  const { breadCrumbItems, isExcerciseBuilderRefresh, setIsExcerciseBuilderRefresh, setIsPatientDetailScreenRefresh, isPatientDetailsScreenRefresh, isExcercisePlanTrackingRefresh, setIsExcercisePlanTrackingRefresh, isExcercisePlanTrackingSessionRefresh, setIsExcercisePlanTrackingSessionRefresh } = useCurrentMainScreenContext();
  
  const isExcerciseBuilder = useMatch("/doctorhome/main/patientDetails/:pid/buildPlan")
  const isPatientDetails = useMatch("/doctorhome/main/patientDetails/:pid")
  const isExcercisePlanTracking = useMatch("/doctorhome/main/patientDetails/:pid/excercisePlans/:epid")
  const isExcercisePlanTrackingSession = useMatch("/doctorhome/main/patientDetails/:pid/excercisePlans/:epid/trackSession")


  const onMiniNavBarReloadClick = () =>{
     if(isPatientDetails){
      setIsPatientDetailScreenRefresh(!isPatientDetailsScreenRefresh);
    } else if(isExcerciseBuilder){
      setIsExcerciseBuilderRefresh(!isExcerciseBuilderRefresh);
    } else if(isExcercisePlanTracking) {
      setIsExcercisePlanTrackingRefresh(!isExcercisePlanTrackingRefresh);
    } else if(isExcercisePlanTrackingSession) {
      setIsExcercisePlanTrackingSessionRefresh(!isExcercisePlanTrackingSessionRefresh);
    }
  }

  return (
    <>
      <div>
        <Flex
          direction="row"
          justify="start"
          align="stretch"
          style={{ display: "flex" }}
        >
          <Flex
            style={{
              flex: 2,
              boxShadow: "9px 0px 18px 4px rgba(0,0,0,0.75)",
              backgroundColor: ThemeColorPallate.foreground,
            }}
          >
            <PatientList></PatientList>
          </Flex>
          <Flex style={{ flex: 5 }}>
            <Flex direction="column" gap="0" p="4" width="100%">
              {/* MINI NAV BAR / BREAD CRUMB BAR */}
              <Nav style={{ backgroundColor: ThemeColorPallate.foreground, zIndex: 9 }}>
                <div style={{ width: "100%", padding: "0 1rem" }}>
                  <Flex
                    justify="between"
                    align="center"
                    style={{ width: "100%" }}
                    gap="4"
                  >
                    <Flex style={{ justifyContent: "start" }}>
                      <CustomBreadcrumb items={breadCrumbItems} />
                    </Flex>
                    <Flex
                      style={{
                        justifyContent: "flex-end",
                        marginRight: "1rem",
                      }}
                    ></Flex>
                    <ReloadIcon
                      onClick={onMiniNavBarReloadClick}
                      width="28" // Adjust size as needed
                      height="28" // Adjust size as needed
                    />
                  </Flex>
                </div>
              </Nav>
              {/* {component} */}
              <Outlet/>
            </Flex>
          </Flex>
        </Flex>
      </div>
    </>
  );
};

export default DoctorHomeLandingPage;
