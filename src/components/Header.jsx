import React from "react";
import "../styles/Header.css";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let userName = "User";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userName = decoded.userName;
      console.log(userName);
    } catch (e) {
      console.error("Token decode failed:", e);
    }
  }
  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <header className="header">
      <div className="logo">NoteLock</div>
      <div className="header-right">
        <button className="feedback-btn">Feedback</button>
        <span className="username">Hi, {userName}</span>
        <button onClick={handleSignOut} className="signout-btn">
          Sign Out
        </button>
      </div>
    </header>
  );
};

export default Header;
