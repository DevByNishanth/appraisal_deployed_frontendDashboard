import React, { useState, useEffect, useContext } from "react";
import { UploadCloud, X, Plus, Trash2 } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Data } from "../../Context/store.js";
import fileIcon from "../../assets/file_icon.svg";

const ResearchForm3 = ({ data, researchPoints }) => {
  const { researchMarks } = useContext(Data);
  const API = import.meta.env.VITE_API
  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const designation = decoded.designation;
  const username = decoded.facultyName;

  const [aictemark, setAictemark] = useState(data?.aictePaper?.marks);
  const [selectedCheck, setSelectedCheck] = useState(
    data?.aictePaper?.value?.status
  );

  const [files, setFiles] = useState(data?.aictePaper?.aictePaperFiles || []);
  // console.log("files000000",files)

  const [fileError, setFileError] = useState("");
  const [designationuser, setDesignationuser] = useState(
    data?.designation || ""
  );
  const [name, setName] = useState(data?.facultyName || "");
  const [id, setId] = useState(data?.employee?._id || "");
  const [inputGroups, setInputGroups] = useState(data.aictePaper?.value?.data);
  // console.log("form 3 : ", inputGroups);
  // ✅ Add input field
  const handleAddInput = () => {
    if (inputGroups.length >= 4) {
      alert("Only four papers are allowed.");
      return;
    }
    setInputGroups((prev) => [...prev, { author: "", typeOfAuthor: "" }]);
  };

  // ✅ Remove input field

  const handleInputCancel = async (i) => {
    // Remove the input group
    const updatedInputGroups = inputGroups.filter((_, index) => index !== i);
    setInputGroups(updatedInputGroups);

    // Prepare form data
    const formData = new FormData();
    formData.append("facultyName", name_name);
    formData.append("aicte", JSON.stringify(updatedInputGroups));
    formData.append("employeeId", employeeId);
    formData.append("designation", userDesignation);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/api/aicte/${designation}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update your marks or other state if needed
      setAictemark(response.data.finalMarks);
    } catch (error) {
      console.error("Error updating input groups:", error);
    }
  };

  // ✅ Checkbox toggle
  const handleCheckbox = async (value) => {
    let val = "";
    if (value.toLowerCase() == "no") {
      val = [];
    } else {
      val = inputGroups;
    }
    const formData = new FormData();
    formData.append("facultyName", name_name);
    formData.append("aicte", JSON.stringify(val));
    formData.append("employeeId", employeeId);
    formData.append("designation", userDesignation);
    // formData.append("sciePaperFiles", files);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/api/aicte/${designation}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAictemark(response.data.finalMarks);
    } catch (err) {
      console.error("Error occured : ", err);
    }
    setSelectedCheck(value);
  };

  const name_name = data.employee.fullName;
  const employeeId = data.employee._id;
  const userDesignation = data.employee.designation;
  const handleInputChange = async (index, field, value) => {
    // 1. Update state
    const updated = [...inputGroups];
    updated[index][field] = value;
    setInputGroups(updated);

    // 2. Prepare FormData
    const formData = new FormData();
    formData.append("aicte", JSON.stringify(updated)); // use updated state, not old one
    formData.append("facultyName", name_name);
    formData.append("designation", userDesignation);
    formData.append("employeeId", employeeId);
    formData.append("files", files);

    // 3. API call
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/api/aicte/${designation}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAictemark(response.data.finalMarks);
      console.log("Saved successfully:", response.data);
    } catch (err) {
      console.error("Error occurred:", err);
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
      {researchPoints?.aicte === 0 ? null : (
        <div className="input-container-2 border border-[#AAAAAA] p-4 bg-white rounded-xl grid gap-4 grid-cols-12">
          <div className="first-container pr-3 border-r border-gray-400 col-span-10">
            <h1 className="text-lg font-medium">
              Papers Published in AICTE / UGC Care List Indexed Journals{" "}
              <span className="text-red-500">*</span>
            </h1>

            {/* Checkbox */}
            <div className="mt-2 px-6 flex items-center justify-between gap-5">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="scale-125 cursor-pointer accent-teal-500"
                    checked={selectedCheck?.toLowerCase() === "yes"}
                    onChange={() => handleCheckbox("Yes")}
                  />
                  <span className="text-[#6f7282]">Yes</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="scale-125 cursor-pointer accent-teal-500"
                    checked={selectedCheck?.toLowerCase() === "no"}
                    onChange={() => handleCheckbox("No")}
                  />
                  <span className="text-[#6f7282]">No</span>
                </label>
              </div>
              {selectedCheck?.toLowerCase() === "yes" && (
                <button
                  onClick={handleAddInput}
                  className="text-white font-semibold px-4 py-2 rounded-md bg-teal-500 flex items-center gap-2 hover:bg-teal-700"
                >
                  Add <Plus />
                </button>
              )}
            </div>

            {/* Dynamic inputs */}
            <div className="input-container w-[70%] flex items-center justify-between gap-4">
              {selectedCheck?.toLowerCase() === "yes" &&
                inputGroups.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 ">
                    <input
                      type="text"
                      placeholder="Name of the paper"
                      className="border border-gray-400 rounded-md px-4 py-2 w-[80%] md:w-[50%]"
                      value={item.author}
                      maxLength={20}
                      onChange={(e) => {
                        const updated = [...inputGroups];
                        updated[index].author = e.target.value;
                        setInputGroups(updated);
                        handleInputChange(index, "author", e.target.value);
                      }}
                    />
                    <select
                      value={item.typeOfAuthor}
                      onChange={(e) => {
                        const updated = [...inputGroups];
                        updated[index].typeOfAuthor = e.target.value;
                        setInputGroups(updated);
                        handleInputChange(
                          index,
                          "typeOfAuthor",
                          e.target.value
                        );
                      }}
                      className="cursor-pointer outline-none border border-gray-400 w-[80%] md:w-[40%] rounded-md px-4 py-2"
                    >
                      <option value="" disabled>
                        Type of Author
                      </option>
                      <option value="Firstauthor">First Author</option>
                      <option value="secondauthor">Second Author</option>
                      <option value="thirdauthor">
                        Third and above Author
                      </option>
                    </select>

                    <div
                      onClick={() => handleInputCancel(index)}
                      className="bg-red-400 rounded-full p-1 w-7 h-7 flex items-center justify-center cursor-pointer"
                    >
                      <Trash2 className="text-white" />
                    </div>
                  </div>
                ))}
            </div>

            <div className="file-container mt-3">
              {selectedCheck?.toLowerCase() === "yes" && Array.isArray(files)
                ? files.map((filePath, idx) => {
                    const normalizedPath = filePath.replace(/\\/g, "/");
                    const fileName = normalizedPath.split("/").pop();

                    return (
                      <div
                        onClick={() => handleFilePreview(files)}
                        key={idx}
                        className="file-card w-fit p-2 file-icon-container border border-gray-300 rounded-lg flex cursor-pointer gap-2"
                      >
                        <img
                          src={fileIcon}
                          className="w-6 h-6"
                          alt="file icon"
                        />
                        <h1 className="truncate max-w-xs text-gray-800">
                          {fileName.slice(0, 15)}
                        </h1>
                      </div>
                    );
                  })
                : null}
            </div>
          </div>

          {/* Marks */}
          <div className="col-span-2 text-center">
            <h1 className="text-lg font-medium">Marks</h1>
            <div className="h-[80%] flex items-center justify-center">
              <h1 className="text-[#646464] text-lg">
                <span className="font-semibold text-[#318179]">
                  {aictemark || 0}
                </span>{" "}
                out of {researchPoints?.aicte}
              </h1>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResearchForm3;
