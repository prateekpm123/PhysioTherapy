import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { firebaseAuth } from "../../databaseConnections/FireBaseConnection"; // Your firebase.js file
import { Accounts } from "../../models/Accounts";

export const SignIn = () => {
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(firebaseAuth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();
      // Send idToken to your backend
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
      // Send idToken to your backend 
      sendIdTokenToBackend(idToken, Accounts.FACEBOOK);
    } catch (error) {
      console.error("Facebook sign-in error:", error);
    }
  }

  const sendIdTokenToBackend = async (idToken: string, accountType: Accounts) => {
    try {
      let url = "http://localhost:3000/auth";
      if(accountType === Accounts.FACEBOOK) {
        url = url + "/facebook";
      } else if(accountType === Accounts.GOOGLE) {
        url = url + "/google";
      }
      const response = await fetch(url, {
        // Your backend endpoint
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
    <div>
      <button onClick={handleGoogleSignIn}>Sign in with Google</button>
      <button onClick={handleFacebookSignIn}>Sign in with Facebook</button>
    </div>
  );
};
