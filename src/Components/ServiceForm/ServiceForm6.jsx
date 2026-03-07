import { React, useContext, useState } from "react";
import { ChevronDown, Upload, UserStar, UploadCloud, X } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Data } from "../../Context/store.js";
import fileIcon from "../../assets/file_icon.svg";

const ServiceForm6 = ({ data, servicePoints }) => {
 const API = import.meta.env.VITE_API
  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const designation = decoded.designation;
  const username = decoded.facultyName;
  // states
  const { serviceMarks } = useContext(Data);

  const [selectedCheck, setSelectedCheck] = useState(data?.training?.value);
  const [files, setFiles] = useState(data?.training?.trainingFiles);
  const [mark, setMark] = useState(data?.training?.marks);
  const name = data.employee.fullName;
  const userDesignation = data.employee.designation;
  const employeeId = data?.employee._id;

  // consoles
  console.log("selected check : ", selectedCheck);

  // function for handling radio button click
  const handleCheckbox = async (value) => {
    console.log("running 3.6 index");

    // Build request payload
    const formData = {
      training: value,
      facultyName: name,
      employeeId: employeeId,
      designation: userDesignation,
    };

    // Update local state first
    setSelectedCheck(value);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/api/training/${designation}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("res training index : ", response);
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
      {servicePoints?.Training == 0 ? (
        ""
      ) : (
        <div className="input-container-2 border border-[#AAAAAA] p-4  bg-white  rounded-xl grid gap-4 grid-cols-12">
          <div className="first-container pr-3 border-r border-gray-400 col-span-10">
            {/* .heading / question  */}
            <div>
              <h1 className="text-lg font-medium">
                Organizing/Handling Training Progremme for External Participants{" "}
                <span className="text-red-500">*</span>
              </h1>
              <p className="text-gray-400 font-medium px-6">
                3 days and above - 5 Points || 2 days - 3 Points || 1 day - 1
                Point
              </p>
            </div>
            {/* input container  */}
            <div className="checkbox-container mt-2 px-6 space-y-2">
              <div className="container-1 flex items-center gap-2">
                <input
                  type="radio"
                  className="scale-125 cursor-pointer accent-teal-500"
                  checked={selectedCheck == "1 day" ? true : false}
                  onChange={() => {
                    handleCheckbox("1 day");
                  }}
                />
                <label className="text-[#6f7282]">1 Day</label>
              </div>
              <div className="container-1 flex items-center gap-2">
                <input
                  type="radio"
                  className="scale-125 cursor-pointer accent-teal-500"
                  checked={selectedCheck == "2 days" ? true : false}
                  onChange={() => {
                    handleCheckbox("2 days");
                  }}
                />
                <label className="text-[#6f7282]">2 Days</label>
              </div>
              <div className="container-1 flex items-center gap-2">
                <input
                  type="radio"
                  className="scale-125 cursor-pointer accent-teal-500"
                  checked={selectedCheck == "3 days & above" ? true : false}
                  onChange={() => {
                    handleCheckbox("3 days & above");
                  }}
                />
                <label className="text-[#6f7282]">3 Days & Above</label>
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
            {/* attachment container  */}
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
          {/* marks container  */}
          <div className="second-container col-span-2 text-center">
            <h1 className="text-lg font-medium">Marks</h1>
            <div className="h-[80%] flex items-center justify-center">
              <h1 className="text-[#646464]  text-lg">
                <span className="font-semibold text-[#318179]">{mark}</span> out
                of {servicePoints?.Training}
              </h1>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServiceForm6;
