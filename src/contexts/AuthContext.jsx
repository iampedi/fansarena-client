// src/contexts/AuthContext.jsx
import { API_URL } from "@/config/api";
import axios from "axios";
import { useEffect, useState } from "react";
import { createContext } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const requiredFields = [
    "name",
    "email",
    "gender",
    "continent",
    "country",
    "city",
    "favoriteClub",
  ];

  const storeToken = (token) => {
    localStorage.setItem("authToken", token);
  };

  const removeToken = () => {
    localStorage.removeItem("authToken");
  };

  const authenticateUser = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setIsLoggedIn(false);
      setUser(null);
      setIsLoading(false);
      return null;
    }

    try {
      const verifyRes = await axios.get(`${API_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userId = verifyRes.data.user._id;
      const userRes = await axios.get(`${API_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(userRes.data);
      setIsLoggedIn(true);
      return userRes.data;
    } catch (err) {
      console.error(err);
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const isComplete = user
    ? requiredFields.every((field) => Boolean(user[field]))
    : false;

  const logOut = () => {
    removeToken();
    authenticateUser();
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        isComplete,
        setUser,
        storeToken,
        authenticateUser,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };
