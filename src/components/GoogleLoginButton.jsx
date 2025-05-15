import React from "react";
import { GoogleLogin } from "@react-oauth/google";

const GoogleLoginButton = () => {
  const handleLogin = (response) => {
    console.log("Google login successful", response);
  };

  const handleFailure = (error) => {
    console.log("Google login failed", error);
  };

  return (
    <GoogleLogin
      onSuccess={handleLogin}
      onError={handleFailure}
      useOneTap
      theme="outline"
      width="100%"
    />
  );
};

export default GoogleLoginButton;
