import React, { useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Data } from "../../Context/store.js";
import { cubicBezierAsString } from "motion";
import fileIcon from "../../assets/file_icon.svg";
const ResearchForm4 = ({ data, researchPoints }) => {
  const { researchMarks } = useContext(Data);
  // states
  const [totalMark, setTotalMarks] = useState(data?.scopusBook?.marks);
  const [selectedValue, setSelectedValue] = useState(data?.scopusBook?.value);
  const [files, setFiles] = useState(data?.scopusBook?.scopusBookFiles);
  // Auth
 const API = import.meta.env.VITE_API
  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const designation = decoded.designation;

  // functions
  async function sendDataToAPI(val) {
    setSelectedValue(val);
    const formData = new FormData();
    formData.append("facultyName", data.facultyName);
    formData.append("employeeId", data?.employee?._id);
    formData.append("designation", data?.designation || "");
    formData.append("numBook", val);
    formData.append("scopusBookFiles", files);
    // const formData = {
    //   // scopusBookFiles : files,
    //   facultyName: data.facultyName,
    //   employeeId: data?.employee?._id,
    //   designation: data?.designation || "",
    //   numBook: val,
    // };
    // console.log("form data is gonna submit : ", formData);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/api/scopusBook/${designation}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedMark = response.data.finalMarks;
      // console.log("Re : ", response);
      // setFiles()
      setTotalMarks(updatedMark);
    } catch (error) {
      console.error("Error occured : ", error.message);
    }
  }
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
    <div className="input-container-2 border border-[#AAAAAA] p-4  bg-white  rounded-xl grid gap-4 grid-cols-12">
      <div className="first-container pr-3 border-r border-gray-400 col-span-10">
        <h1 className="text-lg font-medium">
          Book Published in Scopus / WoS Indexed Series{" "}
          <span className="text-red-500">*</span>
        </h1>
        <h1 className="text-lg font-medium text-gray-600 mx-6">
          2 Points per Book (Max of 4 points)
        </h1>

        {/* radio buttons */}
        <div className="mx-6 mt-2">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="input-container flex items-center gap-3">
              <input
                type="radio"
                className="scale-125 accent-teal-500 cursor-pointer"
                checked={selectedValue == num}
                onChange={() => sendDataToAPI(num)}
              />
              <label className="text-gray-500">{num}</label>
            </div>
          ))}

          <div className="input-container flex items-center gap-3">
            <input
              type="radio"
              className="scale-125 accent-teal-500"
              checked={selectedValue === "None"}
              onChange={() => sendDataToAPI("None")}
            />
            <label className="text-gray-500">None</label>
          </div>
        </div>
        {/* .files container  */}
        <div className="file-container mt-4">
          {files.map((item, index) => {
            const normalizedPath = item.replace(/\\/g, "/");
            const fileName = normalizedPath.split("/").pop();
            return (
              <>
                <div
                  onClick={() => handleFilePreview(files)}
                  className="file-card file-icon-container w-fit p-2 border border-gray-300 rounded-lg flex cursor-pointer gap-2"
                >
                  <img src={fileIcon} className="w-6 h-6" alt="file icon" />
                  <h1 className="text-gray-800">{fileName.slice(0, 15)}</h1>
                </div>
              </>
            );
          })}
        </div>
      </div>

      {/* marks container */}
      <div className="second-container col-span-2 text-center">
        <h1 className="text-lg font-medium">Marks</h1>
        <div className="h-[80%] flex items-center justify-center">
          <h1 className="text-[#646464] text-lg">
            <span className="font-semibold text-[#318179]">{totalMark}</span>{" "}
            out of {researchPoints?.book_scopus}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default ResearchForm4;
