import { useSelector } from "react-redux";
import { UserSessionStateType } from "../../stores/userSessionStore";
import { useNavigate } from "react-router-dom";
// import { User } from "../../models/IUser";
import DoctorNavBar from "./DoctorNavBar";
// import { Flex, Text } from "@radix-ui/themes";
import { Outlet } from "react-router-dom";
import ThemeColorPallate from "../../assets/ThemeColorPallate";

export const DoctorHomePage = () => {
  const isSignedIn = useSelector(
    (state: UserSessionStateType) => state.userSession.isSignedIn
  );
  
  // const user: User = useSelector(
  // (state: UserSessionStateType) => state.userSession.user
  // );
  const navigate = useNavigate();
  if (!isSignedIn) {
    navigate("/signin");
    return;
  }
  return (
    <>
      <div style={{ backgroundColor: ThemeColorPallate.background }}>
        <DoctorNavBar />
        <Outlet/> {/* Render nested routes here */}
        {/* <Flex direction="column" justify="center" align="center">
        <Text size="9"> Welcome {user.name}!</Text>
        <img src={user.pictureUrl} height={200} width={200}></img>
      </Flex> */}
      </div>
    </>
  );
};
