import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import AppraisalFormComponentHeader from "../Components/AppraisalFormComponentHeader";
import EmployeeHeader from "../Components/EmployeeHeader";
import EmployeeCard from "../Components/EmployeeCard";
import VerifiedCard from "../Components/VerifiedCard";

const AppraisalFormPage = () => {
  const [needToVerifyCount, setNeedToVerifyCount] = useState(0);
  const [verifiedCount, setVerifiedCount] = useState(0);
  const [selectedTab, setSelectedTab] = useState("needToBeVerified");



  return (
    <>
      <div className="main-container grid grid-cols-12">
        <div className="sidebar-container col-span-2">
          <Sidebar />
        </div>
        <div className="main-content-container col-span-10">
          <AppraisalFormComponentHeader />
          <EmployeeHeader
            needToVerifyCount={needToVerifyCount}
            verifiedCount={verifiedCount}
            setSelectedTab={setSelectedTab}
          />
          {selectedTab == "needToBeVerified" ? (
            <EmployeeCard
              setNeedToVerifyCount={setNeedToVerifyCount}
              setVerifiedCount={setVerifiedCount}
            />
          ) : (
            <VerifiedCard />
          )}
        </div>
      </div>
    </>
  );
};

export default AppraisalFormPage;
