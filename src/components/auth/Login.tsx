import React, { useEffect, useState } from "react";

// Ensure the Google Identity Services library is loaded

import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
declare const google: any;
export interface DecodedToken {
  email: string;
  name: string;
  picture?: string;
  exp?: number;
}

const CLIENT_ID = "704273243272-83o6oldgf72r8p31jmvcldbh3anuuf7m.apps.googleusercontent.com";

const Login = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to check token validity
  useEffect(() => {
    const checkTokenExpiry = (token: string | null) => {
      if (!token) return;

      try {
        const decoded: DecodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decoded.exp && decoded.exp > currentTime) {
          const timeoutDuration = (decoded.exp - currentTime) * 1000;
          setTimeout(() => {
            handleLogout();
          }, timeoutDuration);
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error("Invalid token:", error);
        handleLogout();
      }
    };

    const handleLogout = () => {
      localStorage.removeItem("token");
      sessionStorage.clear();
      window.location.reload();
    };

    const token = localStorage.getItem("token");
    checkTokenExpiry(token);
  }, []);

  // Function to save user data via API
  const saveUserData = async (userData: DecodedToken) => {
    setIsLoading(true);
    const generatedOrgId = `Parati-${Date.now()}`;
    const signupLink = localStorage.getItem("sign_up_link") || "";

    try {
      const ipInfoResponse = await fetch("https://zynth.ai/api/users/ip-info");
      const ipInfoData = await ipInfoResponse.json();

      const userPayload = {
        userId: userData.email,
        name: userData.name,
        orgId: generatedOrgId,
        pptCount: 0,
        userIPCountry: ipInfoData.country!,
        signupLink: "googleslideextension",
      };

      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/data/userprofile/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userPayload),
      });

      const responseData = await res.json();
      sessionStorage.setItem("authToken", responseData.token);

      if (responseData.orgid) {
        sessionStorage.setItem("orgId", responseData.orgid);
                // ✅ Reload the sidebar (parent) after login
                setTimeout(() => {
                  window.parent.postMessage({ type: "reloadIframe" }, "*");
                }, 1000);
        navigate("/new-presentation");
        
      } else {
        sessionStorage.setItem("orgId", generatedOrgId);
                // ✅ Reload the sidebar (parent) after login
                setTimeout(() => {
                  window.parent.postMessage({ type: "reloadIframe" }, "*");
                }, 1000);
        navigate("/onboarding");
      }
    } catch (error) {
      console.error("Error storing user data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  // adarsha
// ada
  // Function to handle Google login success
  const handleGoogleSuccess = (credentialResponse: any) => {
    if (credentialResponse?.credential) {
      const decoded: DecodedToken = jwtDecode(credentialResponse.credential);

      // Store user info in session storage
      sessionStorage.setItem("userEmail", decoded.email);
      sessionStorage.setItem("userDP", decoded.picture || "");

      setUser(decoded);
      setIsAuthenticated(true);

      // Call API to save user details
      saveUserData(decoded);
    }
  };



  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {isLoading ? (
        <div>Loading...</div>
      ) : isAuthenticated ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome, {user?.name}!</h2>
          <img src={user?.picture} alt="Profile" className="w-20 h-20 rounded-full mb-4" />
          <button
            onClick={() => {
              googleLogout();
              sessionStorage.clear();
              setIsAuthenticated(false);
            }}
            className="bg-red-500 text-white px-6 py-2 rounded-md"
          >
            Logout
          </button>
        </div>
      ) : (
        <GoogleOAuthProvider clientId={CLIENT_ID}>
          <h2 className="text-2xl font-bold mb-4">Login to Continue</h2>
          <GoogleLogin onSuccess={handleGoogleSuccess} />
        </GoogleOAuthProvider>
      )}
    </div>
  );
};

export default Login;