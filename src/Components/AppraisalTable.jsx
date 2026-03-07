import { ChevronDown, Search, ChevronRight } from "lucide-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import no_data from "../assets/no_data_found.jpg";
import { Data } from "../Context/store.js";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const tableHeaderData = [
  "Employee Id",
  "Name",
  "Email",
  "Department",
  "Phone",
  "Role",
  "Status",
  "Action",
];

const AppraisalTable = () => {
  const token = localStorage.getItem("appraisal_token");
  let decoded = "";
  let username = "";
  if (token) {
    try {
      decoded = jwtDecode(token);
      username = decoded.facultyName;
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  console.log("changes made");
  const role = decoded.designation;
  const mail = decoded.email;

  console.log("Testing github repo");
  const navigate = useNavigate();

  const { searchQueryTable, filteredTableData, setSearchQueryTable } =
    useContext(Data);

  // Filter states
  const [showDept, setShowDept] = useState(false);
  const [selectedDept, setSelectedDept] = useState("All");

  const [showDesignation, setShowDesignation] = useState(false);
  const [selectedDesignation, setSelectedDesignation] = useState("All");

  const deptRef = useRef(null);
  const designationRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (deptRef.current && !deptRef.current.contains(event.target)) {
        setShowDept(false);
      }
      if (
        designationRef.current &&
        !designationRef.current.contains(event.target)
      ) {
        setShowDesignation(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔍 Combined Filter Logic
  const filteredEmployees = filteredTableData.filter((emp) => {
    const deptMatch = selectedDept === "All" || emp.department === selectedDept;
    const designationMatch =
      selectedDesignation === "All" || emp.designation === selectedDesignation;
    const searchMatch =
      !searchQueryTable ||
      emp.fullName.toLowerCase().includes(searchQueryTable.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQueryTable.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchQueryTable.toLowerCase());
    return deptMatch && designationMatch && searchMatch;
  });

  console.log("filteredEmployees : ", filteredEmployees)

  // Navigate logic
  function handleNavigation(form_id) {
    console.log("role : ", role);
    if (!form_id) return;

    if (mail === "deanacademics@sece.ac.in" || role?.includes("hod")) {
      navigate(`/appraisal_form/form/${form_id}`);
    } else if (mail === "deaniqac@sece.ac.in" || role?.includes("hod")) {
      navigate(`/appraisal_form/form/${form_id}/service_form`);
    } else if (mail === "deanresearch@sece.ac.in" || role?.includes("hod")) {
      navigate(`/appraisal_form/form/${form_id}/research_form`);
    }
  }

  return (
    <div className="main-header px-6 mt-4">
      <div className="header flex items-center justify-between">
        <h1 className="text-gray-900 text-lg font-medium">Total Employees</h1>

        <div className="flex items-center gap-4">
          {/* Department Filter */}
          <div className="relative w-[200px]" ref={deptRef}>
            <div
              className="header flex items-center justify-between border border-gray-300 rounded-md px-3 py-2 cursor-pointer bg-gray-50"
              onClick={() => setShowDept(!showDept)}
            >
              <h1 className="capitalize">{selectedDept}</h1>
              <ChevronDown
                className={`${
                  showDept ? "rotate-180" : ""
                } transition-all duration-300`}
              />
            </div>

            {showDept && (
              <div className="absolute top-full left-0 bg-white border border-gray-200 shadow-lg rounded-md w-full mt-1 z-20 max-h-[240px] overflow-auto">
                {["All", "AI & ML", "AI & Ds", "CSE", "ECE", "IT", "MECH"].map(
                  (dept) => (
                    <button
                      key={dept}
                      onClick={() => {
                        setSelectedDept(dept);
                        setShowDept(false);
                      }}
                      className="py-2 px-4 text-left w-full hover:bg-gray-100 capitalize"
                    >
                      {dept}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>

          {/* Designation Filter */}
          <div className="relative w-[220px]" ref={designationRef}>
            <div
              className="header flex items-center justify-between border border-gray-300 rounded-md px-3 py-2 cursor-pointer bg-gray-50"
              onClick={() => setShowDesignation(!showDesignation)}
            >
              <h1 className="capitalize">{selectedDesignation}</h1>
              <ChevronDown
                className={`${
                  showDesignation ? "rotate-180" : ""
                } transition-all duration-300`}
              />
            </div>

            {showDesignation && (
              <div className="absolute top-full left-0 bg-white border border-gray-200 shadow-lg rounded-md w-full mt-1 z-20 max-h-[240px] overflow-auto">
                {[
                  "All",
                  "Professor",
                  "Associate Professor",
                  "Assistant Professor",
                ].map((des) => (
                  <button
                    key={des}
                    onClick={() => {
                      setSelectedDesignation(des);
                      setShowDesignation(false);
                    }}
                    className="py-2 px-4 text-left w-full hover:bg-gray-100 capitalize"
                  >
                    {des}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Box */}
          <div className="search-container bg-gray-50 border flex items-center gap-3 w-[300px] border-gray-400 rounded-md px-3 py-2 h-[45px]">
            <Search className="text-gray-600" />
            <input
              type="text"
              placeholder="Search Employees"
              className="text-black outline-none w-[100%] text-lg"
              value={searchQueryTable}
              onChange={(e) => setSearchQueryTable(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex flex-col h-[calc(90vh-300px)] mt-4 border border-gray-200 rounded-md">
        <div className="overflow-y-auto flex-grow">
          <table className="w-full">
            <thead className="bg-[#ebf3f2] sticky top-0">
              <tr>
                {tableHeaderData.map((item, index) => (
                  <th
                    key={index}
                    className="px-4 py-2 font-medium text-left whitespace-nowrap"
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((item, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-100" : ""
                    } text-sm`}
                  >
                    <td className="py-3 pl-4">{item.employeeId}</td>
                    <td className="py-3 pl-4">{item.fullName}</td>
                    <td className="py-4 pl-4">{item.email}</td>
                    <td className="py-4 pl-4">{item.department}</td>
                    <td className="py-3 pl-4">{item.phone_number || "--"}</td>
                    <td className="py-3 pl-4">{item.designation}</td>
                    <td>
                      <button
                        className={`ml-4 px-3 py-1 text-[14px] w-[100px] rounded-md ${
                          item.formStatus.toLowerCase() === "pending"
                            ? "text-red-400 bg-red-50"
                            : "text-green-400 bg-green-50"
                        }`}
                      >
                        {item.formStatus}
                      </button>
                    </td>
                    <td className="py-3 pl-4">
                      {item.formStatus.toLowerCase() === "submitted" ? (
                        <button
                          onClick={() => handleNavigation(item.formId)}
                          className="text-[12px] bg-red-100 text-gray-700 rounded cursor-pointer flex items-center gap-2 px-2 py-1"
                        >
                          {item.approvalStatus}
                        </button>
                      ) : (
                        <h1 className="text-[14px]">Pending</h1>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-500">
                    <div>
                      <img
                        src={no_data}
                        className="h-[140px] w-[140px] m-auto object-cover"
                        alt="No data"
                      />
                      <h1>No employees found</h1>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AppraisalTable;
