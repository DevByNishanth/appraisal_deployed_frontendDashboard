import { ChevronDown, LogOut } from "lucide-react";
import React, { useContext } from "react";
import user_img from "../assets/user-img.svg";
// import { Data } from "../Context/store.js";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
const DashboardHeader = () => {
  const token = localStorage.getItem("appraisal_token");
  let username = "";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      username = decoded.facultyName;
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }
  // hooks declaration
  const navigate = useNavigate();

  // function
  const handleLogOut = () => {
    // Remove token and loggedIn flag
    localStorage.setItem("appraisal_loggedIn", "false");
    localStorage.removeItem("appraisal_token");

    // Optional: if using AuthContext, call logout() instead
    // logout();

    // Reload page only if necessary
    window.location.reload();
  };

  return (
    <>
      <div className="main-container h-[60px] flex items-center justify-between  px-6 bg-[#f9f9f9]">
        <h1 className="font-medium text-lg">Dashboard</h1>
        <div className="dropdown-container flex items-center gap-4 ">
          <div className="first-container ">
            <div className="img-container p-2 rounded-full bg-gray-50 flex items-center gap-3">
              <div className="letter-container bg-teal-600 text-white rounded-full w-7 h-7 flex items-center justify-center  ">
                <h1 className="font-semibold">
                  {username.slice(0, 1).toUpperCase()}
                </h1>
                {console.log("username : ", username)}
              </div>
              <h1 className="font-medium text-lg text-gray-700">{username}</h1>
            </div>
          </div>
          <div className="dropdown-container">
            <LogOut
              onClick={handleLogOut}
              className="w-8 h-6 text-gray-700 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardHeader;
