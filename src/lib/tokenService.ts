import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_ROLE_KEY = 'userRole';

/* ACCESS TOKEN */

export function setAccessToken(token: string) {
  const twoHoursInMilliseconds = 2 * 60 * 60 * 1000;
  Cookies.set(ACCESS_TOKEN_KEY, token, { expires: twoHoursInMilliseconds });
}

export function getAccessToken() {
  return Cookies.get(ACCESS_TOKEN_KEY);
}

export function removeAccessToken() {
  Cookies.remove(ACCESS_TOKEN_KEY);
}

/* REFRESH TOKEN */

export function setRefreshToken(token: string) {
  Cookies.set(REFRESH_TOKEN_KEY, token, { expires: 30 });
}

export function getRefreshToken() {
  return Cookies.get(REFRESH_TOKEN_KEY);
}

export function removeRefreshToken() {
  Cookies.remove(REFRESH_TOKEN_KEY);
}

/* USER ROLE */

export function setUserRole(role: string) {
  Cookies.set(USER_ROLE_KEY, role, { expires: 30 });
}

export function getUserRole() {
  return Cookies.get(USER_ROLE_KEY);
}

export function removeUserRole() {
  Cookies.remove(USER_ROLE_KEY);
}

export function validateAccessToken() {
    const accessToken = getAccessToken();
  
    if (!accessToken) {
      return false;
    }
  
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));      
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
  
      return currentTime < expirationTime;
    } catch (error) {
      return false;
    }
}

export function validateRefreshToken() {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return false;
  }

  try {
    const payload = JSON.parse(atob(refreshToken.split('.')[1]));      
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();

    return currentTime < expirationTime;
  } catch (error) {
    return false;
  }
}
