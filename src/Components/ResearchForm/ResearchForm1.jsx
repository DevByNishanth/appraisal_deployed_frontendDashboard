import React, { useContext, useEffect, useState } from "react";
import { ChevronDown, X, Trash2, Plus, PlusCircle } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Data } from "../../Context/store.js";
import fileIcon from "../../assets/file_icon.svg";

const ResearchForm1 = ({ data }) => {
  const { setResearchPoints } = useContext(Data);

  const API = import.meta.env.VITE_API

  // 🔹 Auth
  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const designation = decoded.designation;

  // 🔹 Context
  // const { setResearchMarks } = useContext(Data);

  // 🔹 States
  const [pointsData, setPointsData] = useState([]);
  const [isDropDown, setDropdown] = useState(false);
  const [selectedCheck, setSelectedCheck] = useState(
    data?.sciePaper?.value?.status
  );
  const [remarkData, setRemarkData] = useState("");
  const [fileError, setFileError] = useState("");
  const [sciemark, setSciemark] = useState(data?.sciePaper?.marks);
  const [scieoutmark, setScieoutmark] = useState("");
  const [sciePapermark, setSciePapermark] = useState(0);
  const [designationuser, setDesignationuser] = useState(
    data?.designation || ""
  );
  const [name, setName] = useState("");
  const [id, setId] = useState(data?.employee?._id || "");
  const [files, setFiles] = useState(data?.sciePaper.sciePaperFiles || []);
  // console.log("form 1 files : ", files)
  const [error, setError] = useState(false);
  const name_name = data.employee.fullName;
  const employeeId = data.employee._id;
  const userDesignation = data.employee.designation;
  const [inputGroups, setInputGroups] = useState(data?.sciePaper?.value?.data);

  // 🔹 Add input
  const handleAddInput = () => {
    if (inputGroups.length >= 4) {
      alert("Only four papers are allowed.");
      return;
    }
    setInputGroups((prev) => [...prev, { author: "", typeOfAuthor: "" }]);
  };

  // 🔹 Remove input
  const handleInputCancel = (i) => {
    setError(false);
    setInputGroups((prev) => prev.filter((_, index) => index !== i));
  };

  // 🔹 Checkbox (Yes / No)
  const handleCheckbox = async (value) => {
    let val = "";
    if (value.toLowerCase() == "no") {
      val = [];
    } else {
      val = inputGroups;
    }
    const formData = new FormData();
    formData.append("facultyName", name_name);
    formData.append("scie", JSON.stringify(val));
    formData.append("employeeId", employeeId);
    formData.append("designation", userDesignation);
    formData.append("sciePaperFiles", files);
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
      setSciemark(response.data.finalMarks);
    } catch (err) {
      console.error("Error occured : ", err);
    }
    setSelectedCheck(value);
  };

  // 🔹 Validation
  function handleError(value) {
    if (value.length >= 18) {
      setError(true);
    } else {
      setError(false);
    }
  }

  // 🔹 API: Send SCIE data
  async function sendDataToAPI(value) {
    const formData = new FormData();
    formData.append("scie", JSON.stringify(value));
    formData.append("facultyName", data?.facultyName || name);
    formData.append("employeeId", id);
    formData.append("designation", designationuser);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API}/api/scie/${designation}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // console.log("Upload successful");
      // console.log("Response data:", res.data);

      if (res.data.finalMarks !== undefined) {
        setSciemark(res.data.finalMarks);
        // setResearchMarks((prev) => ({ ...prev, scie: res.data.finalMarks }));
      }

      return res.data;
    } catch (err) {
      console.error("File upload failed:", err);
    }
  }

  // 🔹 Fetch points from API
  useEffect(() => {
    if (!designation || !token) return;

    const fetchAllData = async () => {
      try {
        const pointsResponse = await axios.get(
          `${import.meta.env.VITE_API}/api/points/${designationuser}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // console.log("Full API Response:", pointsResponse.data);

        const researchData = pointsResponse.data.find(
          (item) => item.category === "research"
        );

        const sciePoints = researchData?.points?.scie || 0;
        setScieoutmark(sciePoints);
        console.log("points : ", pointsResponse.data[1].points);
        setResearchPoints(pointsResponse.data[1].points);

        setRemarkData(researchData);
      } catch (error) {
        console.error(
          "Error fetching points:",
          error.response?.data || error.message
        );
      }
    };

    fetchAllData();
  }, [designation, token]);

  // 🔹 Preview uploaded file
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
  const handleInputAdd = async () => {
    setInputGroups((prev) => [
      ...prev,
      { author: "", typeOfAuthor: "" }, // new blank row
    ]);
  };

  const handleInputChange = async (index, field, value) => {
    const updated = [...inputGroups];
    updated[index][field] = value;
    setInputGroups(updated);

    const formData = new FormData();
    formData.append("scie", JSON.stringify(inputGroups));
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
      setSciemark(response.data.finalMarks);
    } catch (err) {
      console.error("Error occured : ", err);
    }
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
      setSciemark(response.data.finalMarks);

      console.log("Response:", response.data);
    } catch (err) {
      console.error("Error occurred:", err);
    }
  };

  return (
    <>
      <div className="input-container-2 border border-[#AAAAAA] p-4 bg-white rounded-xl grid gap-4 grid-cols-12">
        {/* Left Section */}
        <div className="first-container pr-3 border-r border-gray-400 col-span-10">
          <h1 className="text-lg font-medium">
            Papers Published in SCIE / SSCI / AHCI Indexed Journals{" "}
            <span className="text-red-500">*</span>
          </h1>

          {/* Yes / No */}
          <div className="checkbox-container mt-2 px-6 flex items-center justify-between gap-5">
            <div className="flex items-center gap-5">
              <div className="container-1 flex items-center gap-2">
                <input
                  type="checkbox"
                  className="scale-125 cursor-pointer accent-teal-500"
                  checked={selectedCheck === "yes"}
                  onChange={() => {
                    setSelectedCheck("yes");
                    handleCheckbox("yes");
                  }}
                />
                <label className="text-[#6f7282]">Yes</label>
              </div>
              <div className="container-1 flex items-center gap-2">
                <input
                  type="checkbox"
                  className="scale-125 cursor-pointer accent-teal-500"
                  checked={selectedCheck === "No"}
                  onChange={() => {
                    setSelectedCheck("No");
                    handleCheckbox("No");
                  }}
                />
                <label className="text-[#6f7282]">No</label>
              </div>
            </div>
            {selectedCheck == "yes" && (
              <button
                onClick={handleInputAdd}
                className="bg-teal-500 rounded-md py-2 px-4 flex items-center gap-2 text-white cursor-pointer"
              >
                Add
                <Plus className="text-white" />
              </button>
            )}
          </div>

          <div className="mt-4">
            {inputGroups?.map((item, index) => (
              <div
                key={index}
                className="input-container-1 flex gap-2 items-center mb-2"
              >
                <input
                  type="text"
                  value={item.author}
                  onChange={(e) =>
                    handleInputChange(index, "author", e.target.value)
                  }
                  className="border outline-none rounded px-4 py-2"
                  placeholder="Enter name of the paper"
                />
                <div className="dropdown-container">
                  <select
                    value={item.typeOfAuthor} // bind to the same value as input
                    onChange={(e) =>
                      handleInputChange(index, "typeOfAuthor", e.target.value)
                    } // trigger same handler as input
                    className="border border-gray-500 rounded py-2 px-2 outline-none"
                  >
                    <option value="" disabled>
                      Select Author
                    </option>
                    <option value="Firstauthor">First Author</option>
                    <option value="secondauthor">Second Author</option>
                    <option value="thirdauthor">Third and above Author</option>
                  </select>
                </div>

                {/* <input
                  type="text"
                  value={item.typeOfAuthor}
                  onChange={(e) =>
                    handleInputChange(index, "typeOfAuthor", e.target.value)
                  }
                  className="border outline-none rounded px-4 py-2"
                  placeholder="Enter Type of Author"
                /> */}
                <button
                  onClick={() => handleRemove(index)}
                  className="cursor-pointer bg-red-400 p-1 rounded-full w-8 h-8 flex items-center justify-center"
                >
                  <Trash2 className="text-white h-[90%]" />
                </button>
              </div>
            ))}
          </div>

          {error && (
            <h1 className="text-red-400 text-sm mx-6">
              Should not exceed more than 18 characters
            </h1>
          )}

          {/* File Preview */}
          {selectedCheck?.toLowerCase() === "no"
            ? null
            : files.map((filePath, idx) => {
                const normalizedPath = filePath.replace(/\\/g, "/");
                const fileName = normalizedPath.split("/").pop();

                return (
                  <div
                    key={idx}
                    onClick={() => handleFilePreview(files)}
                    className="file-card  file-icon-container w-fit p-2 border border-gray-300 rounded-lg flex cursor-pointer gap-2"
                  >
                    <img src={fileIcon} className="w-6 h-6" alt="file icon" />
                    <h1 className="truncate max-w-xs text-gray-800">
                      {fileName.slice(0, 15)}
                    </h1>
                  </div>
                );
              })}
        </div>

        {/* Right Section - Marks */}
        <div className="second-container col-span-2 text-center">
          <h1 className="text-lg font-medium">Marks</h1>
          <div className="h-[80%] flex items-center justify-center">
            <h1 className="text-[#646464] text-lg">
              <span className="font-semibold text-[#318179]">
                {sciemark || 0}
              </span>{" "}
              out of {scieoutmark || 0}
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResearchForm1;
