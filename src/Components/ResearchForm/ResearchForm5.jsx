import React, { useState, useContext } from "react";
import fileIcon from "../../assets/file_icon.svg";
import { ChevronDown } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Data } from "../../Context/store.js";


const ResearchForm5 = ({ data, researchPoints }) => {
 const API = import.meta.env.VITE_API
  const { researchMarks } = useContext(Data);

  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const designation = decoded.designation;
  const username = decoded.facultyName;

  const name = data.employee.fullName;
  const userDesignation = data.employee.designation;
  const employeeId = data.employee._id;

  // states
  const [isDropDown, setDropdown] = useState(false);
  const [selectedCheck, setSelectedCheck] = useState(
    data.indexBook.value !== "" ? "Yes" : "No"
  );
  const [numberOfPapers, setNumberOfPapers] = useState(
    data.indexBook.value === "" ? "No. of Books" : data.indexBook.value
  );
  const [files, setFiles] = useState(data?.indexBook?.indexBookFiles || []);
  const [indexedBookmark, setIndexedBookmark] = useState(data.indexBook.marks);

  // handle Yes/No checkbox
  const handleCheckbox = async (value) => {
    setSelectedCheck(value);

    if (value === "No") {
      // reset when No is selected
      setNumberOfPapers("No. of Books");
      setFiles([]);
      setIndexedBookmark(0);

      const formData = new FormData();
      formData.append("numPaper", JSON.stringify(0));
      formData.append("facultyName", name);
      formData.append("designation", userDesignation);
      formData.append("employeeId", employeeId);

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API}/api/IndexedBook/${designation}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIndexedBookmark(response.data.finalMarks);
      } catch (err) {
        console.error("Error updating for No:", err);
      }
    }
  };

  // handle number selection
  const handleBtnClick = async (val) => {
    setNumberOfPapers(val);

    const formData = new FormData();
    formData.append("numPaper", JSON.stringify(val));
    formData.append("facultyName", name);
    formData.append("designation", userDesignation);
    formData.append("employeeId", employeeId);

    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/api/IndexedBook/${designation}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIndexedBookmark(response.data.finalMarks);
    } catch (err) {
      console.error("Error occurred:", err);
    }
  };

  // file preview
  // async function handleFilePreview(fileName) {
  //   try {
  //     const response = await axios.get(
  //       `${import.meta.env.VITE_API}/api/file/${fileName}`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //         responseType: "blob",
  //       }
  //     );
  //     const fileURL = URL.createObjectURL(response.data);
  //     window.open(fileURL, "_blank");
  //   } catch (err) {
  //     console.error("error:", err.message);
  //   }
  // }
  const handleFilePreview = (files) => {
    window.open(files[0], "_blank");
  };
  return (
    <div className="input-container-2 border border-[#AAAAAA] p-4 bg-white rounded-xl grid gap-4 grid-cols-12">
      <div className="first-container pr-3 border-r border-gray-400 col-span-10">
        {/* heading */}
        <h1 className="text-lg font-medium">
          Papers Published in Scopus / WoS Indexed Book Chapters /
          Conference Proceedings <span className="text-red-500">*</span>
        </h1>

        {/* Yes/No checkboxes */}
        <div className="checkbox-container mt-2 px-6 flex items-center gap-5">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="scale-125 accent-teal-400 cursor-pointer"
              checked={selectedCheck === "Yes"}
              onChange={() => handleCheckbox("Yes")}
            />
            <label className="text-[#6f7282]">Yes</label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="scale-125 accent-teal-400 cursor-pointer"
              checked={selectedCheck === "No"}
              onChange={() => handleCheckbox("No")}
            />
            <label className="text-[#6f7282]">No</label>
          </div>
        </div>

        {/* Dropdown + files (only if Yes) */}
        {selectedCheck === "Yes" && (
          <div className="dropdown-attachment-container px-6">
            {/* Dropdown */}
            <div className="select-dropdown-container mt-2 w-[170px] relative bg-white z-20">
              <div className="header flex items-center justify-between border border-[#8B9AA9] rounded-lg px-2 py-2">
                <input
                  type="text"
                  value={numberOfPapers}
                  readOnly
                  placeholder="No. of Books"
                  className="text-[#8B9AA9] w-full outline-none"
                />
                <ChevronDown
                  onClick={() => setDropdown(!isDropDown)}
                  className={`cursor-pointer transition-transform duration-200 ${
                    isDropDown && "rotate-180"
                  }`}
                />
              </div>

              {isDropDown && (
                <div className="content-container shadow-lg w-[210px] bg-white border rounded-b-lg border-gray-200 absolute top-full">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        handleBtnClick(num);
                        setDropdown(false);
                      }}
                      className="px-3 py-1 hover:bg-gray-100 w-full border-b border-gray-100 text-left cursor-pointer"
                    >
                      {num}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* File list */}
            <div className="file-container mt-4">
              {files.map((item, index) => {
                const normalizedPath = item.replace(/\\/g, "/");
                const fileName = normalizedPath.split("/").pop();
                return (
                  <div
                    key={index}
                    onClick={() => handleFilePreview(files)}
                    className="file-card w-fit p-2 border border-gray-300 rounded-lg flex cursor-pointer gap-2 hover:bg-gray-100"
                  >
                    <img src={fileIcon} className="w-6 h-6" alt="file icon" />
                    <h1 className="text-gray-800">{fileName.slice(0, 15)}</h1>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Marks */}
      <div className="second-container col-span-2 text-center">
        <h1 className="text-lg font-medium">Marks</h1>
        <div className="h-[80%] flex items-center justify-center">
          <h1 className="text-[#646464] text-lg">
            <span className="font-semibold text-[#318179]">
              {indexedBookmark || 0}
            </span>{" "}
            out of {researchPoints?.indexbook}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default ResearchForm5;
