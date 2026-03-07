import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // decoded payload
  const logoutTimerRef = useRef(null);
  const navigate = useNavigate();

  const clearLogoutTimer = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  };

  const scheduleAutoLogout = (exp) => {
    clearLogoutTimer();
    if (!exp) return;
    const currentTimeSec = Date.now() / 1000;
    const msUntilExpiry = Math.max(0, (exp - currentTimeSec) * 1000);
    // If already expired, logout immediately:
    if (msUntilExpiry <= 0) {
      handleLogout();
      return;
    }
    logoutTimerRef.current = setTimeout(() => {
      handleLogout();
    }, msUntilExpiry);
  };

  const handleLogin = (token) => {
    try {
      localStorage.setItem("appraisal_token", token);
      localStorage.setItem("appraisal_loggedIn", "true");
      const decoded = jwtDecode(token);
      setUser(decoded);
      setIsAuthenticated(true);
      if (decoded.exp) scheduleAutoLogout(decoded.exp);
    } catch (err) {
      console.error("Login: invalid token", err);
      handleLogout();
    }
  };

  const handleLogout = () => {
    clearLogoutTimer();
    localStorage.removeItem("appraisal_token");
    localStorage.removeItem("appraisal_loggedIn");
    setIsAuthenticated(false);
    setUser(null);
    // navigate to a safe route (login or home)
    navigate("/", { replace: true });
  };

  const checkTokenOnLoad = () => {
    const token = localStorage.getItem("appraisal_token");
    if (!token) {
      handleLogout();
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; // seconds
      if (decoded.exp && decoded.exp < currentTime) {
        // expired
        handleLogout();
      } else {
        setUser(decoded);
        setIsAuthenticated(true);
        if (decoded.exp) scheduleAutoLogout(decoded.exp);
      }
    } catch (err) {
      // invalid token format
      handleLogout();
    }
  };

  // run on mount
  useEffect(() => {
    checkTokenOnLoad();
    // cleanup timer on unmount
    return () => clearLogoutTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
