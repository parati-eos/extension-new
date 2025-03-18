import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
  email: string;
  name: string;
  picture?: string;
}

const CLIENT_ID = "1053104378274-jchabnb9vv91n94l76g97aeuuqmrokt9.apps.googleusercontent.com";

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleSuccess = (credentialResponse: any) => {
    if (credentialResponse?.credential) {
      const decoded: DecodedToken = jwtDecode(credentialResponse.credential);

      // Store user info in session storage
      sessionStorage.setItem("userEmail", decoded.email);
      sessionStorage.setItem("userDP", decoded.picture || "");

      // Redirect to Onboarding
      navigate("/onboarding");
    }
  };

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("userEmail");
    if (storedEmail) {
      navigate("/onboarding"); // Redirect if already logged in
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Login to Continue</h2>
      <GoogleOAuthProvider clientId={CLIENT_ID}>
        <GoogleLogin onSuccess={handleGoogleSuccess} />
      </GoogleOAuthProvider>
    </div>
  );
};

export default Login;
