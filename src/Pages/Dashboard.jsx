import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import DashboardHeader from "../Components/DashboardHeader";
import StatCard from "../Components/StatCard";
import AppraisalTable from "../Components/AppraisalTable";
import LoginForm from "../Components/LoginForm";
const Dashboard = ({ isLoggedIn }) => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const loggedIn = localStorage.getItem("loggedIn");
  return (
    <>
      <div className="main-container grid grid-cols-12">
        <div className="sidebar-container col-span-2">
          <Sidebar />
        </div>
        <div className="main-content-container col-span-10">
          <DashboardHeader />
          <StatCard />
          <AppraisalTable />
        </div>
      </div>
      {/* <div className="tint-1 fixed top-0 right-0 bottom-0 left-0"></div> */}
    </>
  );
};

export default Dashboard;
