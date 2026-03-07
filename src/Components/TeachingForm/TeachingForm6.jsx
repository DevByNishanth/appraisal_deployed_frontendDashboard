import React, { useEffect, useRef, useState, useContext } from "react";
import { ChevronDown, UploadCloud } from "lucide-react";

import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Data } from "../../Context/store.js";
import fileIcon from "../../assets/file_icon.svg";

const TeachingForm6 = ({ data }) => {
  console.log("datadta00000", data);
 const API = import.meta.env.VITE_API
  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const designation = decoded.designation;
  const username = decoded.facultyName;
  const markdata = localStorage.getItem("appraisal_outofmark");
  const parsedMarkData = JSON.parse(markdata);

  // State
  const [firstDropdown, setFirstDropdown] = useState(false);
  const [secondDropdown, setSecondDropdown] = useState(false);
  // Parse the string value safely
  const parsedValue = data?.studentProject?.value
    ? JSON.parse(data.studentProject.value)
    : { projectGuidance: 0, studentPublication: 0 };

  // Now set states
  const [projectGuidance, setProjectGuidance] = useState(
    parsedValue.projectGuidance
  );
  const [studentPublication, setStudentPublication] = useState(
    parsedValue.studentPublication
  );

  const [projectPublication, setProjectPublication] = useState(
    data.studentProject.marks
  );
  const [none, setNone] = useState(true); 
  const [files, setFiles] = useState([]);

  // Refs
  const firstDropdownRef = useRef(null);
  const secondDropdownRef = useRef(null);

  // API call for dropdown changes
  const handleApiCall = async (value, type) => {
    if (type === "guidance") setProjectGuidance(value);
    if (type === "publication") setStudentPublication(value);

    setFirstDropdown(false);
    setSecondDropdown(false);

    const publications = {
      projectGuidance: type === "guidance" ? value : projectGuidance,
      studentPublication: type === "publication" ? value : studentPublication,
      None: false,
    };

    const formData = new FormData();
    formData.append("publications", JSON.stringify(publications));
    formData.append("facultyName", data.facultyName);
    formData.append("designation", data.designation);
    formData.append("employeeId", data.employee._id);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API}/api/publications/${designation}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjectPublication(res.data.finalMarks);
    } catch (err) {
      console.error("Dropdown API error:", err.response?.data || err.message);
    }
  };

 useEffect(() => {
  if (projectGuidance === 0 && studentPublication === 0) {
    setNone(true);
  } else {
    setNone(false);
  }
}, [projectGuidance, studentPublication]);

  // Handle None checkbox
  const handleNone = async () => {
    const newNone = !none;
    setNone(newNone);

    if (newNone) {
      // ✅ Clear everything when "None" is checked
      setProjectGuidance(null);
      setStudentPublication(null);
      setFiles([]);
    }

    const publications = {
      projectGuidance: newNone ? 0 : projectGuidance,
      studentPublication: newNone ? 0 : studentPublication,
      None: newNone,
    };

    const formData = new FormData();
    formData.append("publications", JSON.stringify(publications));
    formData.append("facultyName", data.facultyName);
    formData.append("designation", data.designation);
    formData.append("employeeId", data.employee._id);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API}/api/publications/${designation}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjectPublication(res.data.finalMarks);
    } catch (err) {
      console.error("None API error:", err.response?.data || err.message);
    }
  };

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        firstDropdownRef.current &&
        !firstDropdownRef.current.contains(e.target)
      ) {
        setFirstDropdown(false);
      }
      if (
        secondDropdownRef.current &&
        !secondDropdownRef.current.contains(e.target)
      ) {
        setSecondDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // async function handleFilePreview(fileName) {
  //   try {
  //     const response = await axios.get(
  //       `${import.meta.env.VITE_API}/api/file/${fileName}`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //         responseType: "blob", // 👈 file comes as binary blob
  //       }
  //     );

  //     // create a blob URL
  //     const fileURL = URL.createObjectURL(response.data);

  //     // open in new tab
  //     window.open(fileURL, "_blank");
  //   } catch (err) {
  //     console.error("error:", err.message);
  //   }
  // }
  const handleFilePreview = (files) => {
    window.open(files[0], "_blank");
  };

  return (
    <div className="main-container border p-5 border-[#AAAAAA] bg-white rounded-xl">
      <div className="input-container-3 grid gap-4 grid-cols-12">
        {/* First Section */}
        <div className="first-container pr-3 border-r border-gray-400 col-span-10">
          <h1 className="text-lg font-medium">
            6. Student Project and Publications{" "}
            <span className="text-red-500">*</span>
          </h1>

          {/* Project Guidance */}
          <h1 className="text-lg text-[#646464] font-medium mt-1">
            1. U.G / P.G. Project Guidance - 1 Point (per Student/Max -2
            Students)
          </h1>
          <div
            ref={firstDropdownRef}
            className="dropdwon-container relative mt-2 ml-3 w-[220px] border rounded"
          >
            <div
              onClick={() => !none && setFirstDropdown(!firstDropdown)} // ✅ disable when None selected
              className={`header flex items-center justify-between px-2 py-2 cursor-pointer ${
                none ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""
              }`}
            >
              <h1>
                {projectGuidance !== null
                  ? projectGuidance
                  : "Number of projects"}
              </h1>
              <ChevronDown
                className={`${
                  firstDropdown ? "rotate-180" : "rotate-0"
                } transition-all duration-300`}
              />
            </div>
            {firstDropdown && !none && (
              <div className="dropdown w-full z-10 absolute top-full shadow-lg border bg-gray-50">
                {[0, 1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleApiCall(num, "guidance")}
                    className="w-full py-2 text-left px-2 hover:bg-gray-200 border-b"
                  >
                    {num}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Student Publication */}
          <h1 className="text-lg text-[#646464] font-medium mt-1">
            2. Projects converted to Student Publication (Scopus/WoS) – 2 Points
            (per paper)
          </h1>
          <div
            ref={secondDropdownRef}
            className="dropdwon-container relative mt-2 ml-3 w-[260px] border rounded"
          >
            <div
              onClick={() => !none && setSecondDropdown(!secondDropdown)} // ✅ disable when None selected
              className={`header flex items-center justify-between gap-4 px-2 py-2 cursor-pointer ${
                none ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""
              }`}
            >
              <h1>
                {studentPublication !== null
                  ? studentPublication
                  : "Number of Publication"}
              </h1>
              <ChevronDown
                className={`${
                  secondDropdown ? "rotate-180" : "rotate-0"
                } transition-all duration-300`}
              />
            </div>
            {secondDropdown && !none && (
              <div className="dropdown w-full z-10 absolute top-full shadow-lg  bg-gray-100">
                {[0, 1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleApiCall(num, "publication")}
                    className="w-full py-2 text-left px-2 hover:bg-gray-200 "
                  >
                    {num}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* None Checkbox */}
          <div className="none-container mt-2 flex gap-3">
            <input
              type="checkbox"
              className="accent-teal-500 border scale-125 cursor-pointer"
              checked={none}
              onChange={handleNone}
            />
            <label>None</label>
          </div>

          {/* File Upload */}

          {files?.map((fileItem, idx) => {
            // if it's a string path
            let normalizedPath = "";
            if (typeof fileItem === "string") {
              normalizedPath = fileItem.replace(/\\/g, "/");
            }
            // if it's an object with path
            else if (fileItem?.path) {
              normalizedPath = fileItem.path.replace(/\\/g, "/");
            }
            // if it's a File object (from input)
            else if (fileItem?.name) {
              normalizedPath = `uploads/${fileItem.name}`;
            } else {
              console.warn("Unexpected file format:", fileItem);
              return null; // skip invalid item
            }

            const fileUrl = `${API}/${normalizedPath}`;
            const fileName = normalizedPath.split("/").pop();

            return (
              <div
                key={idx}
                onClick={() => handleFilePreview(files)}
                className="file-card w-fit p-2 file-icon-container rounded-lg flex cursor-pointer gap-2"
              >
                <div className="img-container file-icon-container p-2 rounded">
                  <img src={fileIcon} className="w-6 h-6" alt="file icon" />
                </div>
                <div className="content-container">
                  <h1 className="truncate max-w-xs">{fileName.slice(0, 15)}</h1>
                </div>
              </div>
            );
          })}
        </div>

        {/* Second Section */}
        <div className="second-container col-span-2 text-center">
          <h1 className="text-lg font-medium">Marks</h1>
          <div className="h-[80%] flex items-center justify-center">
            <h1 className="text-[#646464] text-lg">
              <span className="font-semibold text-[#318179]">
                {projectPublication || 0}
              </span>{" "}
              out of {parsedMarkData?.points?.projectPublication}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeachingForm6;
