import React, { useContext } from "react";
import logo from "../assets/logo.svg";
import { Data } from "../Context/store.js";
import dashboard_icon from "../assets/dashboard_icon.svg";
import icon_2 from "../assets/icon_2.svg";
import green_dashboard_icon from "../assets/dashboard_green_icon.svg";
import appraisal_white_icon from "../assets/appraisal_white_icon.svg";
import sidebar_img from "../assets/sidebar_img.svg";
import { Link, useLocation } from "react-router-dom";
const Sidebar = () => {
  const location = useLocation();
  const path = location.pathname.replace("/", "");
  // console.log("path name : ", path);

  // context data
  const { activeTab, setActiveTab } = useContext(Data);
  return (
    <>
      <div className="main-container w-full bg-[#F9F9F9] h-[100vh]  relative">
        <div className="header flex justify-center">
          <img src={logo} className="w-[240px] " />
        </div>
        <div className="button-container px-3 flex justify-center mt-6">
          <div className="buttons space-y-3 w-[100%]">
            <Link
              to="/"
              onClick={() => setActiveTab("dashboard")}
              className={` w-[100%] rounded-md py-2 text-start px-3 flex cursor-pointer items-center gap-2 ${
                path == ""
                  ? "bg-[#318179] text-white hover:bg-[#196059]"
                  : "text-[#318179] hover:border-1 hover:border-[#318179]"
              }`}
            >
              {path == "" ? (
                <img src={dashboard_icon} alt="" />
              ) : (
                <img src={green_dashboard_icon} />
              )}
              Dashboard
            </Link>
            <Link
              to="/appraisal_form"
              className={` w-[100%] rounded-md py-2 text-start px-3 flex cursor-pointer items-center gap-2 ${
                path == "appraisal_form" || path.includes("appraisal_form")
                  ? "bg-[#318179] text-white hover:bg-[#196059]"
                  : "text-[#318179] hover:border-1 hover:border-[#318179]"
              }`}
            >
              {path == "appraisal_form" ? (
                <img src={appraisal_white_icon} />
              ) : (
                <img src={icon_2} />
              )}
              Appraisal Form
            </Link>
          </div>
        </div>
        <div className="img-container absolute bottom-0">
          <img src={sidebar_img} className="" />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
