import React, { useContext, useEffect, useState } from "react";
import { ChevronDown, UploadCloud } from "lucide-react";
import { Data } from "../../Context/store.js";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const ServiceForm4 = ({ data, servicePoints }) => {
  console.log("service4444444444", data);
  const API = import.meta.env.VITE_API

  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const designation = decoded.designation;
  const username = decoded.facultyName;

  const { serviceMarks } = useContext(Data);

  // Example: assuming you already fetched `data` from API

  // extract values safely
  const parsedValue = data?.external?.value
    ? JSON.parse(data.external.value)
    : [];

  const resourcePerson = Array.isArray(parsedValue)
    ? parsedValue.find((r) => r.role === "ResourcePerson") || { count: 0 }
    : { count: 0 };

  const events = (Array.isArray(parsedValue) ? parsedValue : [parsedValue || []])
  .find((r) => r.role === "Events") || { count: 0 };


  // initialize state
  const [selectedCheck, setSelectedCheck] = useState(
    resourcePerson.count > 0 ? "Yes" : "No"
  );
  const [externalProgramCount, setExternalProgramCount] = useState(
    resourcePerson.count
  );

  const [selectedCheck2, setSelectedCheck2] = useState(
    events.count > 0 ? "Yes" : "No"
  );
  const [externalEventsCount, setExternalEventsCount] = useState(events.count);

  // ✅ example for files and marks
  const [files, setFiles] = useState(data?.external?.externalFiles || []);
  const [mark, setMark] = useState(data?.external?.marks || 0);

  const [rolesvalues, setRolesvalues] = useState(0);

  const [dropdown1, setDropdown1] = useState(false);
  const [dropdown2, setDropdown2] = useState(false);

  const employeeId = data?.employee._id;
  console.log("employeeId", employeeId);
  const name = data.employee.fullName;
  const userDesignation = data.employee.designation;

  // === API Call ===
  const sendApi = async (programCount, eventCount, check1, check2) => {
    try {
      const resourcePersonMarks = check1 === "Yes" ? programCount * 2 : 0;
      const eventsMarks = check2 === "Yes" ? eventCount * 1 : 0;

      const cocurricular = [
        { role: "ResourcePerson", count: programCount },
        { role: "Events", count: eventCount },
      ];

      // ✅ use FormData
      const formData = new FormData();

      // append cocurricular (as string)
      formData.append("cocurricular", JSON.stringify(cocurricular));

      // append facultyName separately
      formData.append("facultyName", name);

      // append other values if required
      formData.append("employeeId", employeeId);
      formData.append("designation", userDesignation);

      // append files if you have any
      // totalFiles.forEach((file) => formData.append("externalFiles", file));

      const response = await axios.post(
        `${import.meta.env.VITE_API}/api/cocurricular/${designation}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // ✅ important
          },
        }
      );

      setMark(response.data.finalMarks);
      console.log("API Response:", response.data);
    } catch (err) {
      console.error("Post API failed:", err.message);
    }
  };

  // Trigger API whenever values change
  useEffect(() => {
    sendApi(
      externalProgramCount,
      externalEventsCount,
      selectedCheck,
      selectedCheck2
    );
  }, [
    selectedCheck,
    externalProgramCount,
    selectedCheck2,
    externalEventsCount,
  ]);

  return (
    <div className="input-container-2 border border-[#AAAAAA] p-4 bg-white rounded-xl grid gap-4 grid-cols-12">
      <div className="first-container pr-3 border-r border-gray-400 col-span-10">
        <h1 className="text-lg font-medium">
          Co-curricular and Extra-curricular Outreach Programme{" "}
          <span className="text-red-500">*</span>
        </h1>
        <h1 className="text-gray-400 font-medium px-6">
          External Programmes acted as Resource Person – 2 Points / Programme
        </h1>

        {/* Yes/No for Resource Person */}
        <div className="checkbox-container px-6 mt-2 flex items-center gap-4">
          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              className="scale-125 cursor-pointer accent-teal-700"
              checked={selectedCheck === "Yes"}
              onChange={() => setSelectedCheck("Yes")}
            />
            <span className="text-gray-400">Yes</span>
          </label>
          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              className="scale-125 cursor-pointer accent-teal-700"
              checked={selectedCheck === "No"}
              onChange={() => {
                setSelectedCheck("No");
                setExternalProgramCount(0);
              }}
            />
            <span className="text-gray-400">No</span>
          </label>
        </div>

        {/* Dropdown for Programs */}
        {selectedCheck === "Yes" && (
          <div className="dropdown-container w-[210px] relative mt-2 mx-6 p-2 border rounded-md">
            <div className="header flex items-center justify-between gap-x-4">
              <h1>{externalProgramCount || "Number of Programs"}</h1>
              <ChevronDown
                onClick={() => setDropdown1(!dropdown1)}
                className={`text-gray-600 w-6 h-6 cursor-pointer ${
                  dropdown1 && "rotate-180"
                }`}
              />
            </div>
            {dropdown1 && (
              <div className="content-container absolute z-10 bg-white w-full border rounded-md top-full left-0 shadow-xl">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      setExternalProgramCount(num);
                      setDropdown1(false);
                    }}
                    className="w-full px-3 py-1 text-left hover:bg-gray-100"
                  >
                    {num}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Events Section */}
        <h1 className="text-lg font-medium mt-4 px-6">
          Participated in External Events – 1 Point / Event
        </h1>
        <div className="checkbox-container mt-2 flex items-center gap-4 px-6">
          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              className="scale-125 cursor-pointer accent-teal-700"
              checked={selectedCheck2 === "Yes"}
              onChange={() => setSelectedCheck2("Yes")}
            />
            <span className="text-gray-400">Yes</span>
          </label>
          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              className="scale-125 cursor-pointer accent-teal-700"
              checked={selectedCheck2 === "No"}
              onChange={() => {
                setSelectedCheck2("No");
                setExternalEventsCount(0);
              }}
            />
            <span className="text-gray-400">No</span>
          </label>
        </div>

        {/* Dropdown for Events */}
        {selectedCheck2 === "Yes" && (
          <div className="dropdown-container relative w-[210px] mt-2 mx-6 p-2 border rounded-md">
            <div className="header flex items-center justify-between gap-x-4">
              <h1>{externalEventsCount || "Number of Events"}</h1>
              <ChevronDown
                onClick={() => setDropdown2(!dropdown2)}
                className={`text-gray-600 w-6 h-6 cursor-pointer ${
                  dropdown2 && "rotate-180"
                }`}
              />
            </div>
            {dropdown2 && (
              <div className="content-container absolute z-10 bg-white w-full border rounded-md top-full left-0 shadow-xl">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      setExternalEventsCount(num);
                      setDropdown2(false);
                    }}
                    className="w-full px-3 py-1 text-left hover:bg-gray-100"
                  >
                    {num}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* File Upload */}
        {/* {(selectedCheck === "Yes" || selectedCheck2 === "Yes") && (
         
        )} */}
      </div>

      {/* Marks */}
      <div className="second-container col-span-2 text-center">
        <h1 className="text-lg font-medium">Marks</h1>
        <div className="h-[80%] flex items-center justify-center">
          <h1 className="text-[#646464] text-lg">
            <span className="font-semibold text-[#318179]">{mark || 0}</span>{" "}
            out of {servicePoints?.External}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default ServiceForm4;
