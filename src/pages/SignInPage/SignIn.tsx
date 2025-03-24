import {
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { firebaseAuth } from "../../databaseConnections/FireBaseConnection"; // Your firebase.js file
import { Accounts } from "../../models/Accounts";
import {
  Box,
  Card,
  Flex,
  Text,
  Button,
  Skeleton,
  TextField,
  Link,
} from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { FcGoogle, FcVoicemail } from "react-icons/fc"; // Google icon
import { FaFacebook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { SignInDto } from "../../dtos/SignInDto";
import { useDispatch } from "react-redux";
import { setIsSignedIn, setUser } from "../../stores/userSessionSlice";
import { sendIdTokenToBackendSignUp } from "../../controllers/authController";
import { FailedResponseDto } from "../../dtos/FailedResponseDto";
import { StatusAndErrorType } from "../../models/StatusAndErrorType.enum";
import { useToast } from "../../stores/ToastContext";
// import { ToastColors } from "../../components/Toast";

export const SignIn = () => {
  const loading = false;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  // Functions
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(firebaseAuth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();
      sendIdTokenToBackendSignUp(
        idToken,
        Accounts.GOOGLE,
        afterSignInSuccess,
        afterSignInFail
      );
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  const handleFacebookSignIn = async () => {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(firebaseAuth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();
      sendIdTokenToBackendSignUp(
        idToken,
        Accounts.FACEBOOK,
        afterSignInSuccess,
        afterSignInFail
      );
    } catch (error) {
      console.error("Facebook sign-in error:", error);
    }
  };

  const handleEmailSignIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      const user = result.user;
      const idToken = await user.getIdToken();
      sendIdTokenToBackendSignUp(
        idToken,
        Accounts.EMAIL,
        afterSignInSuccess,
        afterSignInFail
      );
    } catch (error) {
      console.error("Email sign-in error:", error);
    }
  };

  const afterSignInSuccess = (data: SignInDto) => {
    console.log("Sign-in success:", data);
    dispatch(setUser(data));
    dispatch(setIsSignedIn(true));
    navigate("/doctor/details")
    // navigate("/doctorhome");
  };

  const afterSignInFail = (response: FailedResponseDto) => {
    if (response.errorCode === StatusAndErrorType.UserAlreadyExists) {
      showToast("User already exists, try logging In");
      // showToast("User already exists", 30000, 'blue');
      // showToast("User already exists", 30000, 'green');
      console.log("User already exists");
    } else if (response.errorCode === StatusAndErrorType.UserNotCreated) {
      console.log("User was not created");
    } else {
      console.log("Sign-in Fail:");
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
                  Sign In
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
                    style={{ width: "100%" }}
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
                    onClick={() =>
                      handleEmailSignIn("test@example.com", "password123")
                    } // Replace with actual input values
                  >
                    <FcVoicemail size="30" style={{ marginRight: "0px" }} />
                    Sign in with Email
                  </Button>
                </Skeleton>
                <Text>
                  Already Signed up ? Login <Link
                    onClick={() => navigate("/login")}
                    href=""
                    highContrast
                    style={{ color: "#5392cd" }}
                  >
                    { "Here"}
                  </Link>
                </Text>
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
                    onClick={handleGoogleSignIn}
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
                    onClick={handleFacebookSignIn}
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
