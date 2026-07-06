import { createContext, useContext, useEffect, useState} from "react";

import api from "../api/api";

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
};

const logAudit = (action, details) => {
  const timestamp = new Date().toISOString();

  console.log(
    `[AUDIT ${timestamp}] ${action}:`,
    details
  );
};    

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    accessToken: null,
    user: null,
    role: null,
    loading: true,
  });

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const refreshResponse = await api.post("/auth/refresh"); {/* returns access token*/}

      const accessToken = refreshResponse.data.access_token;

      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      const meResponse = await api.get("/auth/me");

      setAuthState({
        isAuthenticated: true,
        accessToken,
        user: meResponse.data,
        role: meResponse.data.role,
        loading: false,
      });
    } catch {
      delete api.defaults.headers.common.Authorization;

      setAuthState({
        isAuthenticated: false,
        accessToken: null,
        user: null,
        role: null,
        loading: false,
      });
    }
  };

  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const accessToken = response.data.access_token;

    api.defaults.headers.common.Authorization =
      `Bearer ${accessToken}`;

    const meResponse = await api.get("/auth/me");

    setAuthState({
      isAuthenticated: true,
      accessToken,
      user: meResponse.data,
      role: meResponse.data.role,
      loading: false,
    });

    logAudit("LOGIN", {
      role: meResponse.data.role,
      email: meResponse.data.email,
    });
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      delete api.defaults.headers.common.Authorization;

      logAudit("LOGOUT", {
        role: authState.role,
        email: authState.user?.email,
      });

      setAuthState({
        isAuthenticated: false,
        accessToken: null,
        user: null,
        role: null,
        loading: false,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
