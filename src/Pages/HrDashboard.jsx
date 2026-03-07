import React from "react";
import HrSidebar from "../Components/HrSidebar";
import AppraisalFormComponentHeader from "../Components/AppraisalFormComponentHeader";
import StatCard from "../Components/StatCard";
import ChartOne from "../Components/ChartOne";
import CustomPieChart from "../Components/PieChart";

const HrDashboard = () => {
  return (
    <>
      <div className="main-container grid grid-cols-12">
        <div className="sidebar-container col-span-2">
          <HrSidebar />
        </div>
        <div className="main-content-container col-span-10">
          <AppraisalFormComponentHeader />
          <StatCard />
          <div className="chart-contaiener flex gap-4 mx-6 mt-6">
            <div className="container-1 w-[70%] border border-gray-200 shadow-xl rounded-xl py-4">
              <div className="content-container px-4 mb-4">
                <h1 className="font-semibold text-xl text-[#333333de]">
                  Number of Pending and Submitted
                </h1>
              </div>
              <ChartOne />
            </div>
            <div className="container-1 w-[30%] border border-gray-200 shadow-xl rounded-xl">
              <CustomPieChart />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HrDashboard;
