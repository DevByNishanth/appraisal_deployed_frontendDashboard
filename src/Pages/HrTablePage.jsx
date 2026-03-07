import React from "react";
import HrSidebar from "../Components/HrSidebar";
import AppraisalFormComponentHeader from "../Components/AppraisalFormComponentHeader";
import StatCard from "../Components/StatCard";
import ChartOne from "../Components/ChartOne";
import CustomPieChart from "../Components/PieChart";
import HrTable from "../Components/HrTable";
const HrTablePage = () => {
  return (
    <>
      <div className="main-container grid grid-cols-12">
        <div className="sidebar-container col-span-2">
          <HrSidebar />
        </div>
        <div className="main-content-container col-span-10">
          <AppraisalFormComponentHeader />
          <HrTable />
        </div>
      </div>
    </>
  );
};

export default HrTablePage;
