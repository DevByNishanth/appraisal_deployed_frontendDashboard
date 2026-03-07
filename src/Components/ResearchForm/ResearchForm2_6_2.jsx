import React, { useState } from "react";
import { ChevronDown, Upload, UserStar, UploadCloud, X } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
const ResearchForm2_6_2 = ({ setMark }) => {
  // Auth
  const API = import.meta.env.VITE_API
  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const designation = decoded.designation;
  const username = decoded.facultyName;

  const [selectedCheck, setSelectedCheck] = useState("No");
  const [numPatent, setNumPatent] = useState(0);

  const [dropdown2, setDropdown2] = useState(false);
  const hanldeDropdown = (key) => {
    if (key == "d2") {
      setDropdown2(!dropdown2);
    }
  };

  // function for handling radio button click
  const handleCheckbox = async (value) => {
    setSelectedCheck(value);
    let formData = {};
    if (value == "Yes") {
      formData.patentType = "Utilitygranted";
      formData.numPatent = numPatent;
    }
    // console.log("running", formData);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API}/api/patent/${designation}/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMark(response.data.finalMarks);
    } catch (err) {
      console.error("error occured : ", err.message);
    }
  };

  // function for API call while selecting the number or patent published
  const handleBtnClick = async (value, patent_type) => {
    setDropdown2(false);
    let formData = {};
    formData.patentType = patent_type;
    formData.numPatent = value;
    formData.facultyName = username;
    try {
      const response = await axios.post(`${import.meta.env.VITE_API}/api/patent/${designation}/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      // console.log("Resp : ", response.data);
      setMark(response.data.finalMarks);
    } catch (err) {
      console.log("error occured :", err.message);
    }
  };

  return (
    <>
      <div className="main-container mt-4">
        {/* header  */}
        <div className="header">
          <div>
            <h1 className="text-lg font-medium">
              Utility Patent Granted <span className="text-red-500">*</span>
            </h1>
            <h1 className="text-gray-400 font-medium ">3 Points / Patent</h1>
          </div>
        </div>
        {/* input container  */}
        <div className="checkbox-container mt-2 flex items-center gap-4">
          <div className=" flex items-center gap-2 ">
            <input
              type="checkbox"
              className="scale-125 accent-teal-400 cursor-pointer"
              checked={selectedCheck == "Yes" ? true : false}
              onChange={() => {
                setSelectedCheck("Yes");
                handleCheckbox("Yes");
              }}
            />
            <label className="text-[#6f7282]">Yes</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="scale-125 accent-teal-400 cursor-pointer"
              checked={selectedCheck == "No" ? true : false}
              onChange={() => {
                setSelectedCheck("No");
                handleCheckbox("No");
              }}
            />
            <label className="text-[#6f7282]">No</label>
          </div>
        </div>
        {/* Dropdown  */}
        {selectedCheck == "Yes" && (
          <div className="dropdown-container relative flex items-center gap-2 justify-between border-1 border-gray-500 px-4 py-2 mt-2 rounded-md">
            <h1 className="text-gray-600">Number of Patent Published</h1>
            <ChevronDown
              onClick={() => hanldeDropdown("d2")}
              className={`text-gray-400 cursor-pointer ${dropdown2 && "rotate-180"
                } transition-all duration-300`}
            />
            {dropdown2 && (
              <div className="content-container absolute top-full left-0 bg-white z-1 rounded-md border-1 border-gray-300  w-full shadow-md  shadow-gray-500 ">
                <button
                  onClick={() => {
                    handleBtnClick(1, "Utilitygranted");
                  }}
                  className="py-2 px-4 cursor-pointer border-b-1 border-gray-300 hover:bg-gray-100 text-left w-full"
                >
                  1
                </button>
                <button
                  onClick={() => {
                    handleBtnClick(2, "Utilitygranted");
                  }}
                  className="py-2 px-4 cursor-pointer border-b-1 border-gray-300 hover:bg-gray-100 text-left w-full"
                >
                  2
                </button>
                <button
                  onClick={() => {
                    handleBtnClick(3, "Utilitygranted");
                  }}
                  className="py-2 px-4 cursor-pointer border-b-1 border-gray-300 hover:bg-gray-100 text-left w-full"
                >
                  3
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ResearchForm2_6_2;
