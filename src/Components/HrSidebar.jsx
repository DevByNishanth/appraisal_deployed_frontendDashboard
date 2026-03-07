import React from "react";
import logo from "../assets/logo.svg";
import { Link, useLocation } from "react-router-dom";
import sidebar_img from "../assets/sidebar_img.svg";

const HrSidebar = () => {
  const pathname = useLocation();
  const location = pathname.pathname;
  return (
    <>
      <section className='"main-container w-full bg-[#F9F9F9] h-[100vh]  relative'>
        <div className="header flex justify-center">
          <img src={logo} className="w-[240px] " />
        </div>
        <div className="button-container px-3 flex justify-center mt-6">
          <div className="buttons space-y-3 w-[100%]">
            <Link
              to="/hr_dashboard"
              className={` w-[100%] rounded-md py-2 text-start px-3 flex cursor-pointer items-center gap-2 border ${
                location.toLocaleLowerCase().includes("overalldata")
                  ? "border border-gray-100 bg-gray-100"
                  : "bg-[#318179] text-white"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/hr_dashboard/overAllData"
              className={` w-[100%] rounded-md py-2 text-start px-3 flex cursor-pointer items-center gap-2 ${
                location.toLocaleLowerCase().includes("overalldata")
                  ? "bg-[#318179] text-white"
                  : "border border-gray-100 bg-gray-100"
              } `}
            >
              Appraisal Table
            </Link>
          </div>
        </div>
        <div className="img-container absolute bottom-0">
          <img src={sidebar_img} className="" />
        </div>
      </section>
    </>
  );
};

export default HrSidebar;
