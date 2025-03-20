import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
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
} from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { FcGoogle, FcVoicemail } from "react-icons/fc"; // Google icon
import { FaFacebook } from "react-icons/fa";

export const SignIn = () => {
  const loading = false;
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(firebaseAuth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();
      sendIdTokenToBackend(idToken, Accounts.GOOGLE);
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
      sendIdTokenToBackend(idToken, Accounts.FACEBOOK);
    } catch (error) {
      console.error("Facebook sign-in error:", error);
    }
  };

  const handleEmailSignIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const user = result.user;
      const idToken = await user.getIdToken();
      sendIdTokenToBackend(idToken, Accounts.EMAIL);
    } catch (error) {
      console.error("Email sign-in error:", error);
    }
  };

  const sendIdTokenToBackend = async (idToken: string, accountType: Accounts) => {
    try {
      let url = "http://localhost:3000/auth";
      if (accountType === Accounts.FACEBOOK) {
        url = url + "/facebook";
      } else if (accountType === Accounts.GOOGLE) {
        url = url + "/google";
      } else if (accountType === Accounts.EMAIL) {
        url = url + "/email";
      }
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Backend response:", data);
      } else {
        console.error("Backend request failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending token to backend:", error);
    }
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
                    onClick={() => handleEmailSignIn("test@example.com", "password123")} // Replace with actual input values
                  >
                    <FcVoicemail size="30" style={{ marginRight: "0px" }} />
                    Sign in with Email
                  </Button>
                </Skeleton>

                {/* Add OR with a line */}
                  <Flex align="center" style={{ margin: "20px 0", width: "100%" }}>
                    <Box style={{ flex: 1, height: "1px", backgroundColor: "#c0c0c0" }} />
                    <Text size="4" weight="bold" style={{ margin: "0 10px", color: "#c0c0c0" }}>
                      OR
                    </Text>
                    <Box style={{ flex: 1, height: "1px", backgroundColor: "#c0c0c0" }} />
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
