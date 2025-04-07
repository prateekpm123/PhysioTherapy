import {
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  createUserWithEmailAndPassword,
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
import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { FcGoogle, FcVoicemail } from "react-icons/fc"; // Google icon
import { FaFacebook } from "react-icons/fa";
import { Outlet, useNavigate } from "react-router-dom";
import { SignInDto } from "../../dtos/SignInDto";
import { useDispatch } from "react-redux";
import { setIsSignedIn, setUser } from "../../stores/userSessionSlice";
import { sendIdTokenToBackendSignUp } from "../../controllers/authController";
import { FailedResponseDto } from "../../dtos/FailedResponseDto";
import { StatusAndErrorType } from "../../models/StatusAndErrorType.enum";
import { DefaultToastTiming, useToast } from "../../stores/ToastContext";
// import ErrorHandler from "../../errorHandlers/ErrorHandler";
import { ToastColors } from "../../components/Toast";
// import { ToastColors } from "../../components/Toast";

export const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  // Functions
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(firebaseAuth, provider);
      const user = result.user;
      const idToken = await user.getIdToken(true);
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

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create user with Firebase Auth
      const result = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      const user = result.user;
      
      // Get the ID token
      const idToken = await user.getIdToken(true);
      
      // Send token to backend
      await sendIdTokenToBackendSignUp(
        idToken,
        Accounts.EMAIL,
        afterSignInSuccess,
        afterSignInFail
      );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setLoading(false);
      // Handle Firebase Auth errors
      if (error.code === 'auth/invalid-email') {
        showToast('Invalid email address', undefined, ToastColors.RED);
      } else if (error.code === 'auth/email-already-in-use') {
        showToast('This email is already registered. Please sign in instead.', undefined, ToastColors.RED);
      } else if (error.code === 'auth/weak-password') {
        showToast('Password should be at least 6 characters', undefined, ToastColors.RED);
      } else if (error.code === 'auth/operation-not-allowed') {
        showToast('Email/password accounts are not enabled', undefined, ToastColors.RED);
      } else {
        console.error('Sign up error:', error);
        showToast('An error occurred during sign up. Please try again.', undefined, ToastColors.RED);
      }
    }
  };

  const afterSignInSuccess = (data: SignInDto) => {
    console.log("Sign-in success:", data);
    dispatch(setUser(data));
    dispatch(setIsSignedIn(true));
    navigate("/signup/details");
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
    showToast(response.message, DefaultToastTiming, ToastColors.RED)
    // ErrorHandler(response);
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
        <Outlet></Outlet>
        <Box width="500px">
          <Card size="5">
            <Flex gap="4" align="start" direction={"column"}>
              <Skeleton loading={loading}>
                <Text size="8" weight="bold" data-testid="signinText">
                  Sign In
                </Text>
              </Skeleton>

              <form onSubmit={handleEmailSignIn} style={{ width: '100%' }}>
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
                      style={{ width: "100%" }}
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
                      minLength={6}
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
                      data-testid="emailSigninButton"
                      disabled={loading}
                    >
                      <FcVoicemail size="30" style={{ marginRight: "0px" }} />
                      {loading ? 'Signing in...' : 'Sign in with Email'}
                    </Button>
                  </Skeleton>
                </Flex>
              </form>

              <Text>
                Already Signed up ? Login{" "}
                <Link
                  onClick={() => navigate("/login")}
                  href=""
                  highContrast
                  style={{ color: "#5392cd" }}
                  data-testid="loginLink"
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
                  onClick={handleGoogleSignIn}
                  data-testid="googleSigninButton"
                  disabled={loading}
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
                  onClick={handleFacebookSignIn}
                  data-testid="facebookSigninButton"
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
