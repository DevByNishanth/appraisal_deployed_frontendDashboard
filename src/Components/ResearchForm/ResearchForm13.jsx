import { React, useContext, useState } from "react";
import { ChevronDown, Upload, UserStar, UploadCloud, X } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Data } from "../../Context/store.js";
import fileIcon from "../../assets/file_icon.svg";

const ResearchForm13 = ({ data, researchPoints }) => {
 const API = import.meta.env.VITE_API
  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const designation = decoded.designation;
  const username = decoded.facultyName;
  // states
  const [selectedCheck, setSelectedCheck] = useState(data?.collabrative?.value);
  const [files, setFiles] = useState(data?.collabrative?.collabrativeFiles);
  const [mark, setMark] = useState(data?.collabrative?.marks);
  const [valueyesno, setvalueyesno] = useState("No");
  const { researchMarks } = useContext(Data);
  const name = data.employee.fullName;
  const employeeId = data.employee._id;
  const userDesignation = data.employee.designation;
  // consoles

  // function for handling radio button click
  const handleCheckbox = async (value) => {
    setvalueyesno(value);
    setSelectedCheck(value);
    const formData = new FormData();
    formData.append("facultyName", name);
    formData.append("designation", userDesignation);
    formData.append("employeeId", employeeId);
    formData.append("foreignWork", value);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/api/Collabrative/${designation}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("res collabrative index : ", response);
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
              Collaborative Work With Foreign Universities{" "}
              <span className="text-red-500">*</span>
            </h1>
            <h1 className="px-6 text-gray-400 text-lg">
              Joint funded project / Joint Publications / MoU / Thesis & Fund
              Review
            </h1>
          </div>
          {/* input container  */}
          <div className="checkbox-container mt-2 px-6 space-y-2">
            <div className="container-1 flex items-center gap-2">
              <input
                type="radio"
                className="scale-125 cursor-pointer accent-teal-500"
                checked={selectedCheck == "Yes" ? true : false}
                onChange={() => {
                  handleCheckbox("Yes");
                }}
              />
              <label className="text-[#6f7282]">Yes</label>
            </div>
            <div className="container-1 flex items-center gap-2">
              <input
                type="radio"
                className="scale-125 cursor-pointer accent-teal-500"
                checked={selectedCheck == "No" ? true : false}
                onChange={() => {
                  handleCheckbox("No");
                }}
              />
              <label className="text-[#6f7282]">No</label>
            </div>
          </div>
          <div className="file-container mt-4 space-y-2 ">
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
          <div className="h-[80%] flex items-center justify-center">
            <h1 className="text-[#646464]  text-lg">
              <span className="font-semibold text-[#318179]">{mark || 0}</span>{" "}
              out of {researchPoints?.collabrative}
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResearchForm13;
