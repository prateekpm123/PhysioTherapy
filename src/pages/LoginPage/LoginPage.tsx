import {
  Box,
  Card,
  Flex,
  Text,
  TextField,
  Button,
  Skeleton,
  Link,
} from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { firebaseAuth } from "../../databaseConnections/FireBaseConnection";
import { sendIdTokenToBackendLogin } from "../../controllers/authController";
import { Accounts } from "../../models/Accounts";
import { useNavigate } from "react-router-dom";
import { SignInDto } from "../../dtos/SignInDto";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useDispatch } from "react-redux";
import {
  setDoctorDetails,
  setIsSignedIn,
  setUser,
} from "../../stores/userSessionSlice";
import { FailedResponseDto } from "../../dtos/FailedResponseDto";
import { StatusAndErrorType } from "../../models/StatusAndErrorType.enum";
import { useToast } from "../../stores/ToastContext";
import { ToastColors } from "../../components/Toast";
import { setCookie } from "../../utils/cookies";

export const LoginPage = () => {
  const loading = false;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  // Functions
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      signInWithPopup(firebaseAuth, provider).then((result) => {
        const user = result.user;
        user.getIdToken(true).then((idToken) => {
          // const saveJWT = await saveJwtToken(idToken);
          setCookie("JwtToken", idToken, 1);
          // console.log(saveJWT);
          sendIdTokenToBackendLogin(
            idToken,
            Accounts.GOOGLE,
            afterLoginSuccess,
            afterLoginFail
          );
        });
      });
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  const handleFacebookLogin = async () => {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(firebaseAuth, provider);
      const user = result.user;
      const idToken = await user.getIdToken(true);
      sendIdTokenToBackendLogin(
        idToken,
        Accounts.FACEBOOK,
        afterLoginSuccess,
        afterLoginFail
      );
    } catch (error) {
      console.error("Facebook sign-in error:", error);
    }
  };

  const afterLoginSuccess = (data: SignInDto) => {
    console.log("Sign-in success:", data);
    dispatch(setUser(data));
    dispatch(setDoctorDetails(data.userGoogleAuthData.doctorDetails));
    dispatch(setIsSignedIn(true));
    navigate("/doctorhome/main/newPatient");
  };

  const afterLoginFail = (response: FailedResponseDto) => {
    // @todo if user tries to directly login without signing up then show : Please sign up first
    if (response.errorCode === StatusAndErrorType.UserNotCreated) {
      showToast("User doesn't exists, try signing in", undefined, ToastColors.RED);
      console.log("User was not created");
    } else {
      showToast("Failed to login", undefined, ToastColors.RED);
      console.log("Log-in Fail:");
    }
    dispatch(setIsSignedIn(false));
  };
  return (
    <>
      <Flex
        gap="3"
        direction="column"
        align="center"
        style={{ padding: "50px" }}
      >
        <Box width="500px">
          <Card size="5">
            <Flex gap="4" align="start" direction={"column"}>
              <Skeleton loading={loading}>
                <Text size="8" weight="bold">
                  Login
                </Text>
              </Skeleton>

              <Flex gap="4" direction="column" style={{ width: "100%" }}>
                <Skeleton loading={loading}>
                  <Text as="div" size="4" weight="bold">
                    Email
                  </Text>
                </Skeleton>
                <Skeleton loading={loading}>
                  <TextField.Root
                    placeholder="Email..."
                    size="3"
                    style={{ width: "100%", display: "flex" }}
                  >
                    <TextField.Slot>
                      <MagnifyingGlassIcon height="16" width="16" />
                    </TextField.Slot>
                  </TextField.Root>
                </Skeleton>
                <Skeleton loading={loading}>
                  <Text as="div" size="4" weight="bold">
                    Password
                  </Text>
                </Skeleton>
                <Skeleton loading={loading}>
                  <TextField.Root
                    placeholder="Password..."
                    size="3"
                    style={{ width: "100%" }}
                  >
                    <TextField.Slot side="left">
                      <MagnifyingGlassIcon height="16" width="16" />
                    </TextField.Slot>
                  </TextField.Root>
                </Skeleton>
                <Skeleton loading={loading}>
                  <Button
                    variant="solid"
                    size="3"
                    style={{ marginTop: "10px" }}
                  >
                    Login
                  </Button>
                  <Text>
                    Not Signed up ? Sign in{" "}
                    <Link
                      href=""
                      highContrast
                      onClick={() => navigate("/signup")}
                      style={{ color: "#5392cd" }}
                    >
                      Here
                    </Link>
                  </Text>
                </Skeleton>
                {/* Add OR with a line */}
                <Flex
                  align="center"
                  style={{ margin: "20px 0", width: "100%" }}
                >
                  <Box
                    style={{
                      flex: 1,
                      height: "1px",
                      backgroundColor: "#c0c0c0",
                    }}
                  />
                  <Text
                    size="4"
                    weight="bold"
                    style={{ margin: "0 10px", color: "#c0c0c0" }}
                  >
                    OR
                  </Text>
                  <Box
                    style={{
                      flex: 1,
                      height: "1px",
                      backgroundColor: "#c0c0c0",
                    }}
                  />
                </Flex>

                <Skeleton loading={loading}>
                  <Button
                    variant="solid"
                    size="3"
                    style={{ marginTop: "10px" }}
                    onClick={handleGoogleLogin}
                  >
                    <FcGoogle size="30" style={{ marginRight: "0px" }} />
                    Sign in with Google
                  </Button>
                </Skeleton>
                <Skeleton loading={loading}>
                  <Button
                    variant="solid"
                    size="3"
                    disabled={true}
                    style={{ marginTop: "10px" }}
                    onClick={handleFacebookLogin}
                  >
                    <FaFacebook size="30" style={{ marginRight: "0px" }} />
                    Sign in with Facebook
                  </Button>
                </Skeleton>
              </Flex>
            </Flex>
          </Card>
        </Box>
      </Flex>
    </>
  );
};
