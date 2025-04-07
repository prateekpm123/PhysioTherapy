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
import React, { useState } from 'react';
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
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
import { setAuthToken } from "../../utils/cookies";

export const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Sign in with Firebase Auth
      const result = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const user = result.user;
      
      // Get the ID token
      const idToken = await user.getIdToken(true);
      
      // Get the token's expiration time
      const tokenResult = await user.getIdTokenResult();
      const expiresIn = new Date(tokenResult.expirationTime).getTime() - Date.now();
      
      // Set both token and expiry
      await setAuthToken(idToken, expiresIn / 1000);
      
      // Send token to backend
      await sendIdTokenToBackendLogin(
        idToken,
        Accounts.EMAIL,
        afterLoginSuccess,
        afterLoginFail
      );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setLoading(false);
      // Handle Firebase Auth errors
      if (error.code === 'auth/invalid-email') {
        showToast('Invalid email address', undefined, ToastColors.RED);
      } else if (error.code === 'auth/user-disabled') {
        showToast('This account has been disabled', undefined, ToastColors.RED);
      } else if (error.code === 'auth/user-not-found') {
        showToast('No account found with this email. Please sign up first.', undefined, ToastColors.RED);
      } else if (error.code === 'auth/wrong-password') {
        showToast('Incorrect password. Please try again.', undefined, ToastColors.RED);
      } else {
        console.error('Login error:', error);
        showToast('An error occurred during login. Please try again.', undefined, ToastColors.RED);
      }
    }
  };

  // Functions
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      signInWithPopup(firebaseAuth, provider).then((result) => {
        const user = result.user;
        user.getIdToken(true).then(async (idToken) => {
          // Get the token's expiration time
          const tokenResult = await user.getIdTokenResult();
          const expiresIn = new Date(tokenResult.expirationTime).getTime() - Date.now();
          
          // Set both token and expiry
          await setAuthToken(idToken, expiresIn / 1000);
          
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
      
      // Get the token's expiration time
      const tokenResult = await user.getIdTokenResult();
      const expiresIn = new Date(tokenResult.expirationTime).getTime() - Date.now();
      
      // Set both token and expiry
      await setAuthToken(idToken, expiresIn / 1000);
      
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
    navigate("/doctorhome/main/newPatient");
    dispatch(setIsSignedIn(true));
    if (!data.userGoogleAuthData.doctorDetails) {
      navigate("/signup/details");
    } else {
      dispatch(setDoctorDetails(data.userGoogleAuthData.doctorDetails));
    }
  };

  const afterLoginFail = (response: FailedResponseDto) => {
    // @todo if user tries to directly login without signing up then show : Please sign up first
    if (response.errorCode === StatusAndErrorType.UserNotCreated) {
      showToast(
        "User doesn't exists, try signing in",
        undefined,
        ToastColors.RED
      );
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
                <Text size="8" weight="bold" data-testid="loginText">
                  Login
                </Text>
              </Skeleton>

              <form onSubmit={handleEmailLogin} style={{ width: '100%' }}>
                <Flex gap="4" direction="column" style={{ width: "100%" }}>
                  <Skeleton loading={loading}>
                    <Text as="div" size="4" weight="bold" data-testid="emailLabel">
                      Email
                    </Text>
                  </Skeleton>
                  <Skeleton loading={loading}>
                    <TextField.Root
                      placeholder="Email..."
                      size="3"
                      style={{ width: "100%", display: "flex" }}
                      data-testid="emailInput"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      type="email"
                    >
                      <TextField.Slot>
                        <MagnifyingGlassIcon height="16" width="16" />
                      </TextField.Slot>
                    </TextField.Root>
                  </Skeleton>
                  <Skeleton loading={loading}>
                    <Text as="div" size="4" weight="bold" data-testid="passwordLabel">
                      Password
                    </Text>
                  </Skeleton>
                  <Skeleton loading={loading}>
                    <TextField.Root
                      placeholder="Password..."
                      size="3"
                      style={{ width: "100%" }}
                      data-testid="passwordInput"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      type="password"
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
                      type="submit"
                      data-testid="loginButton"
                      disabled={loading}
                    >
                      {loading ? 'Logging in...' : 'Login'}
                    </Button>
                  </Skeleton>
                </Flex>
              </form>

              <Text>
                Not Signed up ? Sign in{" "}
                <Link
                  href=""
                  highContrast
                  onClick={() => navigate("/signup")}
                  style={{ color: "#5392cd" }}
                  data-testid="signupLink"
                >
                  Here
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
                  style={{ marginTop: "10px", width: "100%" }}
                  onClick={handleGoogleLogin}
                  data-testid="googleLoginButton"
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
                  style={{ marginTop: "10px", width: "100%" }}
                  onClick={handleFacebookLogin}
                  data-testid="facebookLoginButton"
                >
                  <FaFacebook size="30" style={{ marginRight: "0px" }} />
                  Sign in with Facebook
                </Button>
              </Skeleton>
            </Flex>
          </Card>
        </Box>
      </Flex>
    </>
  );
};
