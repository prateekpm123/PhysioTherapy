// Setting a cookie:
import Cookies from "js-cookie";
import { getAuth } from "firebase/auth";
import { withRetry } from "./retryHandler";

const TOKEN_KEY = "JwtToken";
const TOKEN_EXPIRY_KEY = "JwtTokenExpiry";

export function setCookie(name: string, value: string, days: number) {
  Cookies.set(name, value, { expires: days }); // Expires in 7 days

  // let expires = "";
  // if (days) {
  //   const date = new Date();
  //   date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  //   expires = "; expires=" + date.toUTCString();
  // }
  // document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Getting a cookie:
export function getCookie(name: string): string | undefined {
  const myCookieValue = Cookies.get(name);
  return myCookieValue;
  // const nameEQ = name + "=";
  // const ca = document.cookie.split(";");
  // for (let i = 0; i < ca.length; i++) {
  //   let c = ca[i];
  //   while (c.charAt(0) === " ") {
  //     c = c.substring(1, c.length);
  //   }
  //   if (c.indexOf(nameEQ) === 0) {
  //     return c.substring(nameEQ.length, c.length);
  //   }
  // }
  // return null;
}

// Erasing a cookie:
export function eraseCookie(name: string) {
  Cookies.remove(name);
  // document.cookie = name + "=; Max-Age=-99999999;";
}

// // Setting a cookie
// Cookies.set('myCookie', 'cookieValue', { expires: 7 }); // Expires in 7 days

// // Getting a cookie
// const myCookieValue = Cookies.get('myCookie');
// console.log(myCookieValue);

// // Erasing a cookie
// Cookies.remove('myCookie');

// Token Management Functions
export async function setAuthToken(token: string, expiresIn: number) {
  const expiryDate = new Date();
  expiryDate.setTime(expiryDate.getTime() + (expiresIn * 1000));
  setCookie(TOKEN_KEY, token, expiresIn / (24 * 60 * 60)); // Convert seconds to days
  setCookie(TOKEN_EXPIRY_KEY, expiryDate.toISOString(), expiresIn / (24 * 60 * 60));
}

export async function getValidAuthToken(): Promise<string> {
  const token = getCookie(TOKEN_KEY);
  const expiryStr = getCookie(TOKEN_EXPIRY_KEY);
  
  if (!token || !expiryStr) {
    throw new Error('No valid token found');
  }

  const expiryDate = new Date(expiryStr);
  const currentTime = new Date();
  const timeUntilExpiration = expiryDate.getTime() - currentTime.getTime();
  const REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds

  if (timeUntilExpiration <= REFRESH_THRESHOLD) {
    try {
      const auth = getAuth();
      if (!auth.currentUser) {
        throw new Error('No user logged in');
      }

      const newToken = await withRetry(
        async () => {
          const token = await auth.currentUser?.getIdToken(true);
          if (!token) {
            throw new Error('Failed to refresh token');
          }
          return token;
        },
        8, // max retries
        1000 // initial delay
      );

      // Get the new token's expiration time
      const tokenResult = await auth.currentUser.getIdTokenResult();
      const expiresIn = new Date(tokenResult.expirationTime).getTime() - Date.now();
      
      // Store the new token
      await setAuthToken(newToken, expiresIn / 1000);
      return newToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  }

  return token;
}

export function clearAuthToken() {
  eraseCookie(TOKEN_KEY);
  eraseCookie(TOKEN_EXPIRY_KEY);
}
