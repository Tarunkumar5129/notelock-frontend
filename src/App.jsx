import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import DashboardPage from "./components/DashboardPage";
import EditorLayout from "./components/editor/EditorLayout";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboardpage" element={<DashboardPage />} />
        <Route path="/editor/:notebookId" element={<EditorLayout />} />
      </Routes>
    </Router>
  );
};

export default App;
