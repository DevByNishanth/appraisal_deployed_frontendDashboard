import { React, useContext, useState } from "react";
import { ChevronDown, Upload, UserStar, UploadCloud, X } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Data } from "../../Context/store.js";
import fileIcon from "../../assets/file_icon.svg";
const ResearchForm7 = ({ data, researchPoints }) => {
  // Auth
 const API = import.meta.env.VITE_API
  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const designation = decoded.designation;
  const username = decoded.facultyName;
  // states
  const { researchMarks } = useContext(Data);
  console.log("h index data : ", data);
  const [selectedCheck, setSelectedCheck] = useState(() => {
    if (data?.hIndex?.value?.toLowerCase() == "none") {
      return "";
    } else {
      return data?.hIndex?.value;
    }
  });
  const [files, setFiles] = useState(data?.hIndex?.hIndexFiles);
  const [mark, setMark] = useState(data.hIndex.marks);
  const name = data.employee.fullName;
  const employeeId = data.employee._id;
  const userDesignation = data.employee.designation;
  // consoles
  console.log("h index data : ");
  // function for handling radio button click
  // Handle Checkbox
  const handleCheckbox = async (value) => {
    const formData = new FormData();
    formData.append("hindex", value);
    formData.append("facultyName", name);
    formData.append("designation", userDesignation);
    formData.append("employeeId", employeeId);
    formData.append("files", files);

    setSelectedCheck(value);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/api/hindex/${designation}`,
        formData, // plain JSON
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("res h index : ", response);
      setMark(response.data.finalMarks);
    } catch (err) {
      console.error("err : ", err.message);
    }
  };
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
    <>
      <div className="input-container-2 border border-[#AAAAAA] p-4  bg-white  rounded-xl grid gap-4 grid-cols-12">
        <div className="first-container pr-3 border-r border-gray-400 col-span-10">
          {/* .heading / question  */}
          <div>
            <h1 className="text-lg font-medium">
              Increase in h - Index <span className="text-red-500">*</span>
            </h1>
          </div>
          {/* input container  */}
          <div className="checkbox-container mt-2 px-6 space-y-2">
            <div className="container-1 flex items-center gap-2">
              <input
                type="radio"
                className="scale-125 accent-teal-400 cursor-pointer"
                checked={selectedCheck == 2 ? true : false}
                onChange={() => {
                  handleCheckbox(2);
                }}
              />
              <label className="text-[#6f7282]">2</label>
            </div>
            <div className="container-1 flex items-center gap-2">
              <input
                type="radio"
                className="scale-125 accent-teal-400 cursor-pointer"
                checked={selectedCheck == 3 ? true : false}
                onChange={() => {
                  handleCheckbox(3);
                }}
              />
              <label className="text-[#6f7282]">3</label>
            </div>
            <div className="container-1 flex items-center gap-2">
              <input
                type="radio"
                className="scale-125 accent-teal-400 cursor-pointer"
                checked={selectedCheck == "5 and above" ? true : false}
                onChange={() => {
                  handleCheckbox("5 and above");
                }}
              />
              <label className="text-[#6f7282]">5 and above</label>
            </div>
            <div className="container-1 flex items-center gap-2">
              <input
                type="radio"
                className="scale-125 accent-teal-400 cursor-pointer"
                checked={selectedCheck == "" ? true : false}
                onChange={() => {
                  handleCheckbox("");
                }}
              />
              <label className="text-[#6f7282]">None</label>
            </div>
          </div>
          <div className="file-container mt-4">
            {files.map((item, index) => {
              const normalizedPath = item.replace(/\\/g, "/");
              const fileName = normalizedPath.split("/").pop();
              return (
                <div
                  key={index}
                  onClick={() => handleFilePreview(files)}
                  className="file-card w-fit p-2 file-icon-container border border-gray-300 rounded-lg flex cursor-pointer gap-2 hover:bg-gray-100"
                >
                  <img src={fileIcon} className="w-6 h-6" alt="file icon" />
                  <h1 className="text-gray-800">{fileName.slice(0, 15)}</h1>
                </div>
              );
            })}
          </div>
        </div>
        {/* marks container  */}
        <div className="second-container col-span-2 text-center">
          <h1 className="text-lg font-medium">Marks</h1>
          {console.log("marks : ", mark)}
          <div className="h-[80%] flex items-center justify-center">
            <h1 className="text-[#646464]  text-lg">
              <span className="font-semibold text-[#318179]">{mark}</span> out
              of {researchPoints?.hindex}
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResearchForm7;
