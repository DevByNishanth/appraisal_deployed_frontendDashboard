import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const ResearchForm10 = ({ data, researchPoints }) => {
 const API =import.meta.env.VITE_API
  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const designation = decoded.designation;

  // Employee info
  const name = data?.employee?.fullName;
  const userDesignation = data?.employee?.designation;
  const employeeId = data?.employee?._id;

  // Marks from API
  const [mark, setMark] = useState(data?.fundedProject?.marks || 0);

  // Parse fundedProject.value safely
  const parsedValue = data?.fundedProject?.value
    ? JSON.parse(data.fundedProject.value)
    : { selected: [], count: {} };

  const selectedFromAPI = parsedValue.selected || [];
  const countsFromAPI = parsedValue.count || {};
  console.log("countsFromAPI",countsFromAPI.PI)

  // Initialize counts only if role exists
  const initialPiCount = selectedFromAPI.includes("PI") ? countsFromAPI.PI || 0 : null;
  const initialCoPiCount = selectedFromAPI.includes("Co-PI") ? countsFromAPI.CoPI || 0 : null;

  // React state
  const [selectedValues, setSelectedValues] = useState(selectedFromAPI);
  const [piCount, setPiCount] = useState(initialPiCount);
  const [coPiCount, setCoPiCount] = useState(initialCoPiCount);
  const [dropdown1, setDropdown1] = useState(false);
  const [dropdown2, setDropdown2] = useState(false);

  // Handle checkbox changes
  const handleCheckboxChange = (value) => {
    if (value === "None") {
      setSelectedValues(["None"]);
      setPiCount(null);
      setCoPiCount(null);
      handleSubmit(["None"], {});
      return;
    }

    setSelectedValues((prev) => {
      const current = Array.isArray(prev) ? prev : [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value) // uncheck
        : [...current.filter((v) => v !== "None"), value]; // check and remove None
      handleSubmit(updated, { PI: piCount, CoPI: coPiCount });
      return updated;
    });
  };

  // Handle form submit
const handleSubmit = async (
  selected = selectedValues,
  counts = { PI: piCount, CoPI: coPiCount }
) => {
  try {
    const formData = new FormData();

    if (selected.includes("None")) {
      formData.append("None", "true");
    } else {
      if (selected.includes("PI") && counts.PI != null) {
        formData.append("PI", counts.PI.toString());
      }
      if (selected.includes("Co-PI") && counts.CoPI != null) {
        formData.append("CoPI", counts.CoPI.toString());
      }
      // ❌ don't append "None" when it's not selected
    }

    formData.append("facultyName", name);
    formData.append("designation", userDesignation);
    formData.append("employeeId", employeeId);

    const response = await axios.post(
      `${import.meta.env.VITE_API}/api/Fund/${designation}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setMark(response.data.finalMarks);
    console.log("Response:", response.data);
  } catch (error) {
    console.error("Error submitting data:", error);
  }
};


  // Handle dropdown number selection for PI
  const handlePiCountChange = (num) => {
    setPiCount(num);
    handleSubmit(selectedValues, { PI: num, CoPI: coPiCount });
  };

  // Handle dropdown number selection for Co-PI
  const handleCoPiCountChange = (num) => {
    setCoPiCount(num);
    handleSubmit(selectedValues, { PI: piCount, CoPI: num });
  };

  return (
    <div className="input-container-2 border border-[#AAAAAA] p-4 bg-white rounded-xl grid gap-4 grid-cols-12">
      {/* Main section */}
      <div className="first-container pr-3 border-r border-gray-400 col-span-10">
        <h1 className="text-lg font-medium">
          Funded Project Min 5L <span className="text-red-500">*</span>
        </h1>
        <div className="header px-6">
          <h1 className="text-gray-400 font-medium">
            PI - 5 Points || Co - PI 2 Points (must sanction during evaluation period)
          </h1>
        </div>

        {/* Checkboxes */}
        <div className="checkbox-container mt-2 px-6">
          {/* PI */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="scale-125 cursor-pointer accent-teal-500"
              checked={selectedValues.includes("PI")}
              onChange={() => handleCheckboxChange("PI")}
            />
            <label className="text-[#6f7282]">PI</label>
          </div>
          {selectedValues.includes("PI") && (
            <div className="dropdown-container border-1 w-[300px] px-2 border-gray-400 rounded-md my-2 relative">
              <div className="header flex items-center gap-4 py-2 justify-between">
                <h1 className="text-gray-600">
                  {piCount || "Number of Funded Projects"}
                </h1>
                <ChevronDown
                  onClick={() => setDropdown1(!dropdown1)}
                  className={`text-gray-400 cursor-pointer ${dropdown1 && "rotate-180"} transition-all duration-300`}
                />
              </div>
              {dropdown1 && (
                <div className="button-container absolute top-full left-0 z-50 rounded-sm bg-white shadow-md w-full border-1 border-gray-300">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        setPiCount(num);
                        setDropdown1(false);
                        handlePiCountChange(num);
                      }}
                      className="hover:bg-gray-200 w-full text-left px-4 py-1 cursor-pointer"
                    >
                      {num}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Co-PI */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="scale-125 cursor-pointer accent-teal-500"
              checked={selectedValues.includes("Co-PI")}
              onChange={() => handleCheckboxChange("Co-PI")}
            />
            <label className="text-[#6f7282]">Co-PI</label>
          </div>
          {selectedValues.includes("Co-PI") && (
            <div className="dropdown-container border-1 w-[300px] px-2 border-gray-400 rounded-md my-2 relative">
              <div className="header flex items-center gap-4 py-2 justify-between">
                <h1 className="text-gray-600">
                  {coPiCount || "Number of Funded Projects"}
                </h1>
                <ChevronDown
                  onClick={() => setDropdown2(!dropdown2)}
                  className={`text-gray-400 cursor-pointer ${dropdown2 && "rotate-180"} transition-all duration-300`}
                />
              </div>
              {dropdown2 && (
                <div className="button-container absolute top-full left-0 z-50 rounded-sm bg-white shadow-md w-full border-1 border-gray-300">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        setCoPiCount(num);
                        setDropdown2(false);
                        handleCoPiCountChange(num);
                      }}
                      className="hover:bg-gray-200 w-full text-left px-4 py-1 cursor-pointer"
                    >
                      {num}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* None */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="scale-125 cursor-pointer accent-teal-500"
              checked={selectedValues.includes("None")}
              onChange={() => handleCheckboxChange("None")}
            />
            <label className="text-[#6f7282]">None</label>
          </div>
        </div>
      </div>

      {/* Marks section */}
      <div className="second-container col-span-2 text-center">
        <h1 className="text-lg font-medium">Marks</h1>
        <div className="h-[80%] flex items-center justify-center">
          <h1 className="text-[#646464] text-lg">
            <span className="font-semibold text-[#318179]">{mark || 0}</span>{" "}
            out of {researchPoints?.fund}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default ResearchForm10;
