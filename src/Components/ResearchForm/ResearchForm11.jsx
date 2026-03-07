import { React, useContext, useState } from "react";
import { ChevronDown, Upload, UserStar, UploadCloud, X } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Data } from "../../Context/store.js";
import fileIcon from "../../assets/file_icon.svg";
const ResearchForm11 = ({ data, researchPoints }) => {
  // states
 const API = import.meta.env.VITE_API
  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const designation = decoded.designation;
  const username = decoded.facultyName;
  const [selectedCheck, setSelectedCheck] = useState(() => {
    if (
      data?.consultancy?.value == "" ||
      data?.consultancy?.value?.toLowerCase() == "none"
    ) {
      return "";
    } else {
      return data?.consultancy?.value;
    }
  });
  const [files, setFiles] = useState(data?.consultancy?.consultancyFiles);
  const [mark, setMark] = useState(data?.consultancy?.marks);
  const { researchMarks } = useContext(Data);
  const name = data.employee.fullName;
  const employeeId = data.employee._id;
  const userDesignation = data.employee.designation;
  // function for handling radio button click
  const handleCheckbox = async (value) => {
    setSelectedCheck(value);
    const formData = new FormData();
    formData.append("consultancy", value);
    formData.append("facultyName", name);
    formData.append("designation", userDesignation);
    formData.append("employeeId", employeeId);
    formData.append("files", files);
    // const formData = {};
    // formData.consultancy = value;
    formData.facultyName = username;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/api/consultancy/${designation}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("res consultancy index : ", response);
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
              Consultancy Work Certified by the Industries{" "}
              <span className="text-red-500">*</span>
            </h1>
          </div>
          {/* input container  */}
          <div className="checkbox-container mt-2 px-6 space-y-2">
            <div className="container-1 flex items-center gap-2">
              <input
                type="radio"
                className="scale-125 cursor-pointer accent-teal-500"
                checked={selectedCheck == "upto one lakh" ? true : false}
                onChange={() => {
                  handleCheckbox("upto one lakh");
                }}
              />
              <label className="text-[#6f7282]">Upto Rs. 1 Lakh</label>
            </div>
            <div className="container-1 flex items-center gap-2">
              <input
                type="radio"
                className="scale-125 cursor-pointer accent-teal-500"
                checked={selectedCheck == "two lakh" ? true : false}
                onChange={() => {
                  handleCheckbox("two lakh");
                }}
              />
              <label className="text-[#6f7282]">Upto Rs. 2 Lakhs</label>
            </div>
            <div className="container-1 flex items-center gap-2">
              <input
                type="radio"
                className="scale-125 cursor-pointer accent-teal-500"
                checked={selectedCheck == "greater than five" ? true : false}
                onChange={() => {
                  handleCheckbox("greater than five");
                }}
              />
              <label className="text-[#6f7282]">More than Rs. 5 Lakhs</label>
            </div>
            <div className="container-1 flex items-center gap-2">
              <input
                type="radio"
                className="scale-125 cursor-pointer accent-teal-500"
                checked={selectedCheck == "" ? true : false}
                onChange={() => {
                  handleCheckbox("");
                }}
              />
              <label className="text-[#6f7282]">None</label>
            </div>
          </div>
          <div className="file-container mt-4 space-y-2">
            {files.map((item, index) => {
              const normalizedPath = item.replace(/\\/g, "/");
              const fileName = normalizedPath.split("/").pop();
              return (
                <div
                  key={index}
                  onClick={() => handleFilePreview(files)}
                  className="file-card w-fit file-icon-container p-2 rounded-lg flex cursor-pointer gap-2 hover:bg-gray-100"
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
          <div className="h-[80%] flex items-center justify-center">
            <h1 className="text-[#646464]  text-lg">
              <span className="font-semibold text-[#318179]">{mark || 0}</span>{" "}
              out of {researchPoints?.consultancy}
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResearchForm11;
