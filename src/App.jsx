import React, { useContext, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import AppraisalFormPage from "./Pages/AppraisalFormPage";

import LoginForm from "./Components/LoginForm";
import FormPage from "./Pages/FormPage";
import { Data } from "./Context/store.js";
import ResearchFormPage from "./Pages/ResearchFormPage";
import ServiceFormPage from "./Pages/ServiceFormPage";
import ThanksPage from "./Pages/ThanksPage";
import { jwtDecode } from "jwt-decode";
import HrDashboard from "./Pages/HrDashboard";
import HrTablePage from "./Pages/HrTablePage";

const App = () => {
  const { activeTab, setActiveTab } = useContext(Data);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const loggedIn = localStorage.getItem("appraisal_loggedIn");
  console.log("logged in : ", loggedIn);
  const token = localStorage.getItem("appraisal_token");
  let designation = "";
  try {
    if (token) {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp && decoded.exp < currentTime) {
        console.warn("Token expired");
        localStorage.removeItem("appraisal_token");
        localStorage.removeItem("appraisal_loggedIn");
        window.location.reload();
      } else {
        designation = decoded.designation;
      }
    }
  } catch (error) {
    console.error("Invalid token:", error);
    localStorage.removeItem("appraisal_token");
    localStorage.removeItem("appraisal_loggedIn");
    window.location.reload();
  }

  console.log("designation:", designation);

  const emailId = "deanIqac@sece.ac.in";
  const role = "dean";

  console.log("designationdesignation", designation);
  return (
    <>
      {loggedIn == "true" ? "" : <LoginForm setIsLoggedIn={setIsLoggedIn} />}

      <Routes>
      <Route index element={<Dashboard isLoggedIn={loggedIn} />} />

        <Route path="/" element={<Dashboard isLoggedIn={loggedIn} />} />

        <Route path="/appraisal_form/form/:form_id" element={<FormPage />} />

        <Route
          path="/appraisal_form/form/:form_id/research_form"
          element={<ResearchFormPage />}
        />

        <Route
          path="/appraisal_form/form/:form_id/service_form"
          element={<ServiceFormPage />}
        />

        <Route
          path="/appraisal_form/form/:form_id/completed"
          element={<ThanksPage />}
        />
        <Route path="/hr_dashboard" element={<HrDashboard />} />
        <Route path="/hr_dashboard/overAllData" element={<HrTablePage />} />

        <Route path="/appraisal_form" element={<AppraisalFormPage />} />
        <Route path="*" element={<Dashboard isLoggedIn={loggedIn} />} />
      </Routes>
    </>
  );
};

export default App;
