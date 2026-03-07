import React, { useState, useEffect, useContext } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Data } from "../../Context/store.js";
import fileIcon from "../../assets/file_icon.svg";

const ResearchForm2 = ({ data, researchPoints }) => {
  const { researchMarks } = useContext(Data);
  const API = import.meta.env.VITE_API

  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const designation = decoded.designation;

  // states
  const [selectedCheck, setSelectedCheck] = useState(
    data?.scopusPaper?.value?.status
  );

  const [files, setFiles] = useState(data?.scopusPaper?.scopusPaperFiles);
  const [fileError, setFileError] = useState("");
  const [scopusemark, setScopusemark] = useState(data?.scopusPaper?.marks);
  const [designationuser, setDesignationuser] = useState(
    data?.designation || ""
  );
  const [name, setName] = useState();
  const [id, setId] = useState(data?.employee?._id || "");
  const [inputGroups, setInputGroups] = useState(
    data?.scopusPaper?.value?.data
  );
  const name_name = data.employee.fullName;
  const employeeId = data.employee._id;
  const userDesignation = data.employee.designation;
  console.log("input groups form 2 : ", inputGroups);
  const [error, setError] = useState(false);

  // Add input
  const handleAddInput = () => {
    if (inputGroups.length >= 4) {
      alert("Only four papers are allowed.");
      return;
    }
    setInputGroups((prev) => [...prev, { author: "", typeOfAuthor: "" }]);
  };

  // Remove input
  const handleInputCancel = (i) => {
    setError(false);
    setInputGroups((prev) => prev.filter((_, index) => index !== i));
  };

  // Checkbox (Yes / No)
  const handleCheckbox = async (value) => {
    let val = "";
    if (value.toLowerCase() == "no") {
      val = [];
    } else {
      val = inputGroups;
    }
    const formData = new FormData();
    formData.append("facultyName", name_name);
    formData.append("scopus", JSON.stringify(val));
    formData.append("employeeId", employeeId);
    formData.append("designation", userDesignation);
    formData.append("sciePaperFiles", files);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/api/scopus/${designation}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setScopusemark(response.data.finalMarks);
    } catch (err) {
      console.error("Error occured : ", err);
    }
    setSelectedCheck(value);
  };
 const handleRemove = async (index) => {
    console.log("running delete button ");
    const updated = inputGroups.filter((_, i) => i !== index);
    setInputGroups(updated);

    const formData = new FormData();
    formData.append("scie", JSON.stringify(updated));
    formData.append("facultyName", name_name);
    formData.append("designation", userDesignation);
    formData.append("employeeId", employeeId);
    formData.append("files", files);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/api/scie/${designation}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setScopusemark(response.data.finalMarks);

      console.log("Response:", response.data);
    } catch (err) {
      console.error("Error occurred:", err);
    }
  };
  // Preview uploaded file
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
  const handleInput = () => {
    setInputGroups((prev) => [...prev, { author: "", typeOfAuthor: "" }]);
  };

  
  const handleInputChange = async (index, field, value) => {
    // 1. Update state
    const updated = [...inputGroups];
    updated[index][field] = value;
    setInputGroups(updated);

    // 2. Prepare FormData
    const formData = new FormData();
    formData.append("scopus", JSON.stringify(updated)); // use updated state, not old one
    formData.append("facultyName", name_name);
    formData.append("designation", userDesignation);
    formData.append("employeeId", employeeId);
    formData.append("files", files);

    // 3. API call
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/api/scopus/${designation}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setScopusemark(response.data.finalMarks);
      console.log("Saved successfully:", response.data);
    } catch (err) {
      console.error("Error occurred:", err);
    }
  };

  return (
    <>
      <div className="input-container-2 border border-[#AAAAAA] p-4 bg-white rounded-xl grid gap-4 grid-cols-12">
        {/* left */}
        <div className="first-container pr-3 border-r border-gray-400 col-span-10">
          <h1 className="text-lg font-medium">
            Papers Published in Scopus / ESCI / WoS Indexed Journals{" "}
            <span className="text-red-500">*</span>
          </h1>

          {/* Yes / No */}
          <div className="checkbox-container mt-2 px-6 flex items-center justify-between gap-5">
            <div className="flex items-center  justify-between gap-4 w-full">
              <div className="container-1 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="scale-125 cursor-pointer accent-teal-500"
                    checked={selectedCheck?.toLowerCase() === "yes"}
                    onChange={() => handleCheckbox("yes")}
                  />
                  <label className="text-[#6f7282]">Yes</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="scale-125 cursor-pointer accent-teal-500"
                    checked={selectedCheck?.toLowerCase() === "no"}
                    onChange={() => handleCheckbox("No")}
                  />
                  <label className="text-[#6f7282]">No</label>
                </div>
              </div>
              <div className="add-btn">
                <button
                  onClick={handleInput}
                  className="bg-teal-500 cursor-pointer text-white flex items-center gap-2 rounded py-2 px-4"
                >
                  Add
                  <Plus />
                </button>
              </div>
            </div>

            {selectedCheck === "Yes" && (
              <button
                onClick={handleAddInput}
                className="text-white font-semibold px-4 py-2 rounded-md bg-teal-500 flex items-center gap-3 cursor-pointer hover:bg-teal-700"
              >
                Add <Plus />
              </button>
            )}
          </div>

          {/* Dynamic Inputs */}

          <div className="contanier-1 mt-4 space-y-2">
            {inputGroups?.map((item, index) => {
              return (
                <div className="input-container  flex items-center gap-3">
                  <input
                    type="text"
                    value={item.author}
                    onChange={(e) => {
                      const updated = [...inputGroups];
                      updated[index].author = e.target.value;
                      setInputGroups(updated);
                      handleInputChange(index, "author", e.target.value); // ✅ author field
                    }}
                    placeholder="Enter author"
                    className="outline-none border rounded border-gray-400 px-2 py-2"
                  />

                  <select
                    value={item.typeOfAuthor}
                    onChange={(e) => {
                      const updated = [...inputGroups];
                      updated[index].typeOfAuthor = e.target.value;
                      setInputGroups(updated);
                      handleInputChange(index, "typeOfAuthor", e.target.value); // ✅ typeOfAuthor field
                    }}
                    className="border border-gray-500 rounded py-2 px-2 outline-none"
                  >
                    <option value="" disabled>
                      Select Author
                    </option>
                    <option value="Firstauthor">First Author</option>
                    <option value="secondauthor">Second Author</option>
                    <option value="thirdauthor">Third and above Author</option>
                  </select>
                  <button
                    onClick={() => handleRemove(index)}
                    className="w-7 h-7 bg-red-400 p-1 cursor-pointer rounded-full flex items-center justify-center"
                  >
                    <Trash2 className="text-white" />
                  </button>
                </div>
              );
            })}
          </div>

          {error && (
            <h1 className="text-red-400 text-sm mx-6">
              Should not exceed more than 18 characters
            </h1>
          )}

          {/* File preview */}

          <div className="file-container mt-3">
            {selectedCheck?.toLowerCase() === "no"
              ? null
              : Array.isArray(files) &&
                files.map((filePath, idx) => {
                  const normalizedPath = filePath.replace(/\\/g, "/");
                  const fileName = normalizedPath.split("/").pop();

                  return (
                    <div
                      key={idx}
                      onClick={() => handleFilePreview(files)}
                      className="file-card w-fit p-2 file-icon-container border border-gray-300 rounded-lg flex cursor-pointer gap-2"
                    >
                      <img src={fileIcon} className="w-6 h-6" alt="file icon" />
                      <h1 className="truncate max-w-xs text-gray-800">
                        {fileName.slice(0, 15)}
                      </h1>
                    </div>
                  );
                })}
          </div>
        </div>

        {/* right - marks */}
        <div className="second-container col-span-2 text-center">
          <h1 className="text-lg font-medium">Marks</h1>
          <div className="h-[80%] flex items-center justify-center">
            <h1 className="text-[#646464] text-lg">
              <span className="font-semibold text-[#318179]">
                {scopusemark || 0}
              </span>{" "}
              out of {researchPoints?.scopus || 0}
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResearchForm2;
