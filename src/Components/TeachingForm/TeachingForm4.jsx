import { ChevronDown, Files } from "lucide-react";
import React, { useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Data } from "../../Context/store.js";
import { useParams } from "react-router-dom";
import fileIcon from "../../assets/file_icon.svg";
import axios from "axios";

const TeachingForm4 = ({ data }) => {
  console.log("sandy:", data);
  const { markData } = useContext(Data);
  const { form_id } = useParams();
  const API = import.meta.env.VITE_API;
  const markdata = localStorage.getItem("appraisal_outofmark");
  // Parse the string into an object
  const parsedMarkData = JSON.parse(markdata);

  const [isDropDown, setIsDropdown] = useState(false);

  const [selectedValue, setSelectedValue] = useState(
    data?.innovativeApproach?.value || "None"
  );
  console.log("selectedValue00000----->", selectedValue);
  const [developmentmark, setDevelopmentmark] = useState(
    data?.innovativeApproach?.marks ?? 0
  );
  const [designationuser, setDesignationuser] = useState(
    data?.designation || ""
  );
  const [name, setName] = useState(data?.facultyName || "");
  const [id, setId] = useState(data?.employee?._id || "");
  const [files, setFiles] = useState(data?.innovativeApproachFiles || []);
  console.log("files----->>>", files);

  // 🔹 decode token
  const token = localStorage.getItem("appraisal_token");
  const decoded = token ? jwtDecode(token) : {};
  const designation = decoded?.designation;

  // 🔹 submit updated value
  const handleTeachingTypeChange = async (value) => {
    setSelectedValue(value);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/api/innovativeApproach/${designation}`,
        {
          InnovativeApproach: value,
          facultyName: name,
          employeeId: id,
          designation: designationuser,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDevelopmentmark(response.data.finalMarks);
      setIsDropdown(false);
    } catch (error) {
      console.error(
        "Error submitting teaching type:",
        error.response?.data || error.message
      );
    }
  };

  // 🔹 load initial value from API/props
  useEffect(() => {
    if (data?.innovativeApproach) {
      setSelectedValue(data.innovativeApproach.value);
      setDevelopmentmark(data.innovativeApproach.marks ?? 0);
      setDesignationuser(data.designation);
      setName(data.facultyName);
      setId(data.employee._id);
      setFiles(data.innovativeApproach.innovativeApproachFiles);
    }
    if (data?.innovativeApproachFiles) {
    }
  }, [data]);
  // async function handleFilePreview(fileName) {
  // console.log("sandy:",fileName);

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
  // useEffect(() => {
  //     if (values === "Yes" && Array.isArray(inputGroups)) {
  //       handleTeachingTypeChange(inputGroups);
  //     }
  //   }, [inputGroups, selectedCheck]);

  const handleFilePreview = (files) => {
    window.open(files[0], "_blank");
  };

  return (
    <div className="main-container border p-5 border-[#AAAAAA] bg-white rounded-xl">
      <div className="input-container-3 grid gap-4 grid-cols-12">
        {/* Left Section */}
        <div className="first-container pr-3 border-r border-gray-400 col-span-10">
          <div>
            <h1 className="text-lg font-medium">
              The development of teaching resource
              <span className="text-red-500">*</span>
            </h1>
            <h1 className="text-lg text-[#646464] font-medium text-[16px] mt-1">
              ( Classroom Teaching - 1 Point || Lab - 2 Points || Both - 3
              Points )
            </h1>
          </div>

          {/* Dropdown */}
          <div className="select-container mt-2 relative">
            <div
              className="header flex items-center justify-between border border-[#8B9AA9] rounded-lg px-2 py-2 cursor-pointer"
              onClick={() => setIsDropdown(!isDropDown)}
            >
              <h1
                className={`${
                  !selectedValue ? "text-[#8B9AA9]" : "text-black"
                }`}
              >
                {selectedValue || "Select Teaching Type"}
              </h1>
              <ChevronDown
                className={`transition-transform duration-200 ${
                  isDropDown ? "rotate-180" : ""
                }`}
              />
            </div>

            {isDropDown && (
              <div className="dropdown-container w-full space-y-3 absolute top-full p-2 bg-white border border-[#AAAAAA] rounded-lg z-10">
                {["Classroom Teaching", "Lab", "Both", "None"].map((option) => (
                  <div
                    key={option}
                    className="input-container flex gap-3 items-center cursor-pointer"
                    onClick={() => handleTeachingTypeChange(option)}
                  >
                    <span className="text-[#8B9AA9]">{option}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="file-attachment-container mt-4 "></div>
          </div>

          {/* Show uploaded files if available */}
          {files.map((filePath, idx) => {
            console.log("sandy1:", files[0]);

            // normalize Windows path (backslashes → forward slashes)
            const normalizedPath = filePath.replace(/\\/g, "/");

            // build file URL
            const fileUrl = `${API}/${normalizedPath}`;

            // extract filename
            const fileName = normalizedPath.split("/").pop();

            return (
              <div
                onClick={() => handleFilePreview(files)}
                className="file-card w-fit  p-2 file-icon-container rounded-lg flex cursor-pointer gap-2"
              >
                <div className="img-container file-icon-container p-2 rounded">
                  <img src={fileIcon} className="w-6 h-6" alt="file icon" />
                </div>
                <div className="content-container">
                  <h1 className="truncate max-w-xs">{fileName.slice(0, 15)}</h1>
                  {/* Optional: if your API also returns file size, show it here */}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Section */}
        <div className="second-container col-span-2 text-center">
          <h1 className="text-lg font-medium">Marks</h1>
          <div className="h-[80%] flex items-center justify-center">
            <h1 className="text-[#646464] text-lg">
              <span className="font-semibold text-[#318179]">
                {developmentmark}
              </span>{" "}
              out of {parsedMarkData?.points?.innovativeApproach || 0}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeachingForm4;
