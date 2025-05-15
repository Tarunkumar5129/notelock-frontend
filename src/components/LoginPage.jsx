// LoginPage.js
import React, { useState } from "react";
import { FaFingerprint } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";
import styles from "../styles/LoginPage.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
  };

  const validateForm = () => {
    if (!email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Invalid email format");
      return false;
    }
    if (!password.trim()) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await axios.post(
        "https://notelock-backend.onrender.com/api/auth/login",
        {
          email,
          password,
        }
      );

      toast.success("Login successful!");
      localStorage.setItem("token", response.data.token);
      navigate("./dashboardpage");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const base64ToUint8Array = (base64) => {
    try {
      const base64String = base64.replace(/-/g, "+").replace(/_/g, "/");
      const binary = window.atob(base64String);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes;
    } catch (error) {
      console.error("Error decoding base64 string:", error);
      return null;
    }
  };

  const handleBiometricLogin = async () => {
    try {
      if (!window.PublicKeyCredential) {
        toast.error("Biometric authentication not supported");
        return;
      }
      const res = await fetch(
        "https://notelock-backend.onrender.com/api/auth/biometric/get-credential-id",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Credential not found");

      const credentialIdUint8 = base64ToUint8Array(data.credentialId);
      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge: crypto.getRandomValues(new Uint8Array(32)),
          allowCredentials: [
            {
              id: credentialIdUint8,
              type: "public-key",
              transports: ["internal"],
            },
          ],
          timeout: 60000,
          userVerification: "required",
        },
      });
      const verifyRes = await fetch(
        "https://notelock-backend.onrender.com/api/auth/biometric/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            credentialId: assertion.id,
          }),
        }
      );

      const verifyData = await verifyRes.json();

      if (verifyRes.ok) {
        localStorage.setItem("token", verifyData.token);
        toast.success("Biometric login successful!");

        window.location.href = "./dashboardpage";
      } else {
        toast.error(verifyData.message || "Biometric login failed.");
      }
    } catch (error) {
      console.error("Biometric Login Error:", error);
      toast.error("Biometric login failed.");
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.loginForm}>
          <h2 className={styles.firstPageLogo}>NoteLock</h2>
          <input
            id={styles.firstPageEmail}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className={styles.passwordContainer}>
            <input
              className={styles.firstPageInputs}
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <span className={styles.separator}>|</span>
            <FaFingerprint
              className={styles.biometricIcon}
              onClick={handleBiometricLogin}
            />
          </div>

          <button onClick={handleLogin} disabled={loading}>
            {loading ? <span className={styles.spinner}></span> : "Login"}
          </button>

          <div className={styles.authLinks}>
            <span className={styles.forgotPassword}>Forgot Password?</span>
            <span
              className={styles.newUser}
              onClick={() => (window.location.href = "/signup")}
            >
              New User? Sign Up
            </span>
          </div>

          <div className={styles.googleLoginContainer}>
            <GoogleLogin
              onSuccess={(res) => console.log(res)}
              onError={() => console.log("Login Failed")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
