import React, { useContext } from "react";
import {
  ChevronDown,
  Upload,
  UserStar,
  UploadCloud,
  X,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Data } from "../../Context/store.js";
import fileIcon from "../../assets/file_icon.svg";

const ServiceForm5 = ({ data, servicePoints }) => {
 const API = import.meta.env.VITE_API
  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const designation = decoded.designation;
  const username = decoded.facultyName;
  const { serviceMarks } = useContext(Data);
  // states
  const [selectedCheck, setSelectedCheck] = useState(
    data?.administration?.value
  );
  const [files, setFiles] = useState(data?.administration?.administrationFiles);
  const [mark, setMark] = useState(data?.administration?.marks);
  const name = data.employee.fullName;
  const userDesignation = data.employee.designation;
  const employeeId = data?.employee._id;

  const handleSubmit = async (value) => {
    console.log("Assistance :", value);
    setSelectedCheck(value);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/api/assistance/${designation}`,
        {
          assistance: value,
          facultyName: name,
          employeeId: employeeId,
          designation: userDesignation,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response for form 3.5:", response.data);

      setMark(response.data.finalMarks);
    } catch (err) {
      console.error(err.message);
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
              Assistance in General Administration{" "}
              <span className="text-red-500">*</span>
            </h1>
            <h1 className="text-gray-400 font-medium px-6">
              Assessed by HoD/IQAC/CFRD/Principal
            </h1>
          </div>
          {/* input container  */}
          <div className="checkbox-container px-6 mt-2 flex items-center gap-4">
            <div className="container-1 flex gap-2 items-center">
              <input
                type="radio"
                name="yesno"
                className="scale-125 cursor-pointer accent-teal-500"
                checked={selectedCheck === "Yes"}
                onChange={() => {
                  setSelectedCheck("Yes");
                  handleSubmit("Yes");
                }}
              />
              <label className="text-gray-400">Yes</label>
            </div>

            <div className="container-1 flex gap-2 items-center">
              <input
                type="radio"
                name="yesno"
                className="scale-125 cursor-pointer accent-teal-500"
                checked={selectedCheck === "No"}
                onChange={() => {
                  setSelectedCheck("No");
                  handleSubmit("No");
                }}
              />
              <label className="text-gray-400">No</label>
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

          {/* Dropdown and attachment container  */}
          {/* {selectedCheck === "Yes" && (
           
          )} */}
        </div>
        {/* marks container  */}
        <div className="second-container col-span-2 text-center">
          <h1 className="text-lg font-medium">Marks</h1>
          <div className="h-[80%] flex items-center justify-center">
            <h1 className="text-[#646464]  text-lg">
              <span className="font-semibold text-[#318179]">{mark}</span> out
              of {servicePoints?.Administration}
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceForm5;
