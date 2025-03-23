// Setting a cookie:
import Cookies from "js-cookie";

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
