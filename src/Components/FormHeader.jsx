import React from "react";
import { ChevronDown, LogOut } from "lucide-react";
import user_img from "../assets/user-img.svg";
import { jwtDecode } from "jwt-decode";
const FormHeader = () => {
  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const username = decoded.facultyName;
  // functions
  const handleLogOut = () => {
    localStorage.setItem("appraisal_loggedIn", "false");
    window.location.reload();
  };
  return (
    <>
      <div className="main-container h-[60px] flex items-center justify-between  px-6 bg-[#f9f9f9]">
        <h1 className="font-medium text-lg">Appraisal Form</h1>
        <div className="dropdown-container flex items-center gap-4 ">
          <div className="first-container ">
            <div className="img-container p-2 rounded-full bg-gray-50 flex items-center gap-3">
              <div className="flex items-center w-7 h-7 rounded-full justify-center text-white bg-teal-700">
              <h1>{username.slice(3,4)}</h1>
              </div>
              <h1 className="font-medium text-lg text-gray-700">{username}</h1>
            </div>
          </div>
          <LogOut onClick={handleLogOut} className="cursor-pointer" />
        </div>
      </div>
    </>
  );
};

export default FormHeader;
