import { React, useContext, useState } from "react";
import { ChevronDown, Upload, UserStar, UploadCloud, X } from "lucide-react";
import ResearchForm2_6_2 from "./ResearchForm2_6_2";
import ResearchForm2_6_3 from "./ResearchForm2_6_3";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Data } from "../../Context/store.js";

const ResearchForm6 = ({ data, researchPoints }) => {
  // Auth
 const API = import.meta.env.VITE_API
  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const designation = decoded.designation;
  const username = decoded.facultyName;
  // states
  const { researchMarks } = useContext(Data);

  const [selectedCheck, setSelectedCheck] = useState(data);
  const [files, setFiles] = useState([]);
  const [numPatent, setNumPatent] = useState(0);
  const [dropdown1, setDropdown1] = useState(false);
  const [dropdown3, setDropdown3] = useState(false);
  const [mark, setMark] = useState(0);

  // ✅ Handle Checkbox Selection
  const handleCheckbox = async (value) => {
    setSelectedCheck(value);

    let formData = {};

    if (value === "Yes") {
      formData.patentType = "Published";
      formData.numPatent = numPatent;
      formData.facultyName = username;
    }

    try {
      const response = await axios.post(`${API}${designation}/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMark(response.data.finalMarks);
    } catch (err) {
      console.error("Checkbox API call failed:", err);
    }
  };

  // function to open and close the dropdown1
  const hanldeDropdown = (key) => {
    if (key == "d1") {
      setDropdown1(!dropdown1);
    }
  };

  // function for API call while selecting the number or patent published
  const handleBtnClick = async (value, patent_type) => {
    setDropdown1(false);
    let formData = {};
    formData.patentType = patent_type;
    formData.numPatent = value;
    formData.facultyName = username;

    try {
      const response = await axios.post(
        `${API}/api/patent/${designation}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMark(response.data.finalMarks);
    } catch (err) {
      console.log("error occured :", err.message);
    }
  };
  const removeFile = async (index) => {
    // const fileName = encodeURIComponent(files[index].name); // encode to handle spaces & special chars
    const fileName = files[index].name;

    try {
      // API call to delete image with fileName in URL
      await axios.delete(`${API}/api/deleteImage/${fileName}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Revoke preview URL if exists
      if (files[index].preview) {
        URL.revokeObjectURL(files[index].preview);
      }

      // Update state after successful deletion
      const updatedFiles = [...files];
      updatedFiles.splice(index, 1);
      setFiles(updatedFiles);

      // Clear error if limit is now fine
      // if (updatedFiles.length < 3) {
      //   setFileError("");
      // }

      // toast.success(`${decodeURIComponent(fileName)} deleted successfully`);
      // toast.success(`${fileName} deleted successfully`);
    } catch (error) {
      console.error(
        "Error deleting file:",
        error.response?.data || error.message
      );
      // toast.error("Failed to delete file");
    }
  };

  return (
    <>
      <div className="input-container-2 border border-[#AAAAAA] p-4  bg-white  rounded-xl grid gap-4 grid-cols-12">
        <div className="first-container pr-3 border-r border-gray-400 col-span-10">
          {/* .heading / question  */}
          <div>
            <h1 className="text-lg font-medium">
              Patent Published <span className="text-red-500">*</span>
            </h1>
            <h1 className="text-gray-400 font-medium mx-6">
              1 Point / Patent (Max - 3 poinst)
            </h1>
          </div>
          {/* input container  */}
          <div className="checkbox-container mt-2 px-6 flex items-center gap-4">
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
          {/* attachment container  */}
          <div className="dropdown-attachment-container px-6">
            {/* Dropdown  */}
            {selectedCheck == "Yes" && (
              <div className="dropdown-container relative flex items-center gap-2 justify-between border-1 border-gray-500 px-4 py-2 mt-2 rounded-md">
                <h1 className="text-gray-600">Number of Patent Published</h1>
                <ChevronDown
                  onClick={() => hanldeDropdown("d1")}
                  className={`text-gray-400 cursor-pointer ${
                    dropdown1 && "rotate-180"
                  } transition-all duration-300`}
                />
                {dropdown1 && (
                  <div className="content-container absolute top-full left-0 bg-white z-1 rounded-md border-1 border-gray-300  w-full shadow-md  shadow-gray-500 ">
                    <button
                      onClick={() => {
                        handleBtnClick(1, "Published");
                      }}
                      className="py-2 px-4 cursor-pointer border-b-1 border-gray-300 hover:bg-gray-100 text-left w-full"
                    >
                      1
                    </button>
                    <button
                      onClick={() => {
                        handleBtnClick(2, "Published");
                      }}
                      className="py-2 px-4 cursor-pointer border-b-1 border-gray-300 hover:bg-gray-100 text-left w-full"
                    >
                      2
                    </button>
                    <button
                      onClick={() => {
                        handleBtnClick(3, "Published");
                      }}
                      className="py-2 px-4 cursor-pointer border-b-1 border-gray-300 hover:bg-gray-100 text-left w-full"
                    >
                      3
                    </button>
                  </div>
                )}
              </div>
            )}
            {/* ========================================================== Form 2 ========================= */}

            <ResearchForm2_6_2 setMark={setMark} />
            <ResearchForm2_6_3 setMark={setMark} />
          </div>
        </div>
        {/* marks container  */}
        <div className="second-container col-span-2 text-center">
          <h1 className="text-lg font-medium">Marks</h1>
          <div className="h-[80%] flex items-center justify-center">
            <h1 className="text-[#646464]  text-lg">
              <span className="font-semibold text-[#318179]">{mark}</span> out
              of {researchPoints?.patent}
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResearchForm6;
