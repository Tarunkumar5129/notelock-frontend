import React, { useState } from "react";
import { FaFingerprint, FaEye, FaEyeSlash } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";
import styles from "../styles/SignupPage.module.css";
import { toast } from "react-toastify";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [useBiometric, setUseBiometric] = useState(false);
  const [userName, setUserName] = useState("");

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
    if (!password) {
      toast.error("Password is required");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await fetch(
        "https://notelock-backend.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userName, email, password }),
        }
      );

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        toast.success(data.message || "Account created successfully!");
        window.location.href = "/";
      } else {
        toast.error(data.message || "Registration failed!");
      }
    } catch (error) {
      setLoading(false);
      console.error("Signup Error:", error);
      toast.error("Something went wrong. Try again.");
    }
  };

  const handleBiometricSignup = async () => {
    try {
      if (!window.PublicKeyCredential) {
        toast.error("Biometric authentication is not supported.");
        return;
      }

      const res = await fetch(
        "https://notelock-backend.onrender.com/api/auth/biometric/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userName, email }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch options");

      const publicKey = data;
      publicKey.challenge = new Uint8Array(
        atob(publicKey.challenge)
          .split("")
          .map((c) => c.charCodeAt(0))
      );
      publicKey.user.id = new Uint8Array(
        atob(publicKey.user.id)
          .split("")
          .map((c) => c.charCodeAt(0))
      );

      const credential = await navigator.credentials.create({ publicKey });

      const credentialData = {
        id: credential.id,
        rawId: credential.rawId.toString("base64"),
        type: credential.type,
        response: {
          clientDataJSON: new Uint8Array(credential.response.clientDataJSON),
          attestationObject: new Uint8Array(
            credential.response.attestationObject
          ),
        },
        email,
      };

      console.log(" Credential Data:", credentialData);

      const verifyRes = await fetch(
        "https://notelock-backend.onrender.com/api/auth/biometric/verify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentialData),
        }
      );

      const verifyData = await verifyRes.json();
      if (verifyRes.ok) {
        toast.success("Biometric registration successful!");
        window.location.href = "/";
      } else {
        toast.error(verifyData.message || "Biometric verification failed.");
      }
    } catch (err) {
      console.error("Biometric Signup Error:", err);
      toast.error("Biometric signup failed.");
    }
  };

  return (
    <div className={styles.signupPage}>
      <div className={styles.loginContainer}>
        <div className={styles.loginForm}>
          <h2 className={styles.firstPageLogo}>Sign Up</h2>
          <input
            id={styles.firstPageEmail}
            type="text"
            placeholder="Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <input
            id={styles.firstPageEmail}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className={styles.passwordContainer}>
            {!useBiometric && (
              <>
                <input
                  className={styles.firstPageInputs}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
                <span className={styles.separator}>|</span>
              </>
            )}
            <FaFingerprint
              className={styles.biometricIcon}
              onClick={handleBiometricSignup}
            />
          </div>

          {!useBiometric && (
            <>
              <div className={styles.passwordContainer}>
                <input
                  className={styles.confirmPassword}
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <button onClick={handleSignup} disabled={loading}>
            {loading ? <span className={styles.spinner}></span> : "Sign Up"}
          </button>

          <div className={styles.authLinks}>
            <span
              className={styles.newUser}
              onClick={() => (window.location.href = "/")}
            >
              Already have an account? Login
            </span>
          </div>

          <div className={styles.googleLoginContainer}>
            <GoogleLogin
              onSuccess={(res) => console.log(res)}
              onError={() => console.log("Sign-Up Failed")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
