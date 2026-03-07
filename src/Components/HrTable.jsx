import { ChevronDown, Download, Search } from "lucide-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import HrTableData from "./HrTableData";
import axios from "axios";
import { Data } from "../Context/store.js";
import LoadingScreen from "../Pages/LoadingSceen";

const HrTable = () => {
  const department_modal = useRef(null);
  const designation_modal = useRef(null);
  const statusDropdownref = useRef(null);
  const { selectedRows } = useContext(Data);
  // states
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState(false);
  const [selectedDesignation, setSelectedDesignation] = useState("all");
  const [designationDropdown, setDesignationDropdown] = useState(false);
  const [statusDropdpwn, setStatusDripdown] = useState(false);
  const [tableData, setTableData] = useState([]); // raw API data
  const [filteredTableData, setFilteredTableData] = useState([]); // after filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [loading, setLoading] = useState(false);

  // outside click handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        department_modal.current &&
        !department_modal.current.contains(e.target)
      ) {
        setDepartmentFilter(false);
      }
      if (
        designation_modal.current &&
        !designation_modal.current.contains(e.target)
      ) {
        setDesignationDropdown(false);
      }
      if (
        statusDropdownref.current &&
        !statusDropdownref.current.contains(e.target)
      ) {
        setStatusDripdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // fetch employees
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("appraisal_token");
      const response = await axios.get(`${import.meta.env.VITE_API}/api/tableData`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const normalized = Array.isArray(response.data)
        ? response.data
        : [response.data];
      setTableData(normalized);
      setFilteredTableData(normalized); // ✅ initial = full
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // apply filters whenever state changes
  useEffect(() => {
    let filtered = [...tableData];

    // search filter (name or employeeId)
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (emp) =>
          emp.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // department filter
    if (selectedDepartment !== "all") {
      filtered = filtered.filter(
        (emp) =>
          emp.department?.toLowerCase() === selectedDepartment.toLowerCase()
      );
    }

    // designation filter
    if (selectedDesignation !== "all") {
      filtered = filtered.filter(
        (emp) =>
          emp.designation?.toLowerCase() === selectedDesignation.toLowerCase()
      );
    }

    // Status filter
    if (selectedStatus.toLowerCase() !== "all") {
      filtered = filtered.filter(
        (emp) => emp.formStatus?.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    setFilteredTableData(filtered);
  }, [
    searchTerm,
    selectedDepartment,
    selectedDesignation,
    selectedStatus,
    tableData,
  ]);

  // overall download
  const handleOverallDownload = async () => {
    setLoading(true);
    try {
      // POST request to backend
      const response = await axios.post(
        `${import.meta.env.VITE_API}/api/multiplePdf`,
        { ids: selectedRows },
        { responseType: "blob" } // 👈 very important for binary ZIP data
      );

      // Convert the blob into a downloadable ZIP file
      const blob = new Blob([response.data], { type: "application/zip" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "reports.zip"; // Download name
      document.body.appendChild(link);
      link.click();
      link.remove();
      setLoading(false);
    } catch (err) {
      console.error("❌ Error downloading PDFs:", err);
      setLoading(false);
    }
  };
useEffect(() => {
  let filtered = [...tableData];

  // Search filter
  if (searchTerm.trim() !== "") {
    filtered = filtered.filter(
      (emp) =>
        emp.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Department filter
  if (selectedDepartment !== "all") {
    filtered = filtered.filter(
      (emp) =>
        emp.department?.toLowerCase() === selectedDepartment.toLowerCase()
    );
  }

  // Designation filter
  if (selectedDesignation !== "all") {
    filtered = filtered.filter(
      (emp) =>
        emp.designation?.toLowerCase() === selectedDesignation.toLowerCase()
    );
  }

  // Status filter
  if (selectedStatus.toLowerCase() !== "all") {
    if (selectedStatus.toLowerCase() === "pending") {
      // Show any status that contains "pending"
      filtered = filtered.filter(
        (emp) =>
          emp.approvalStatus &&
          emp.approvalStatus.toLowerCase()=="pending"
      );
    } else {
      // Show exact match for specific status like "Pending with HOD" or "Approved"
      filtered = filtered.filter(
        (emp) =>
          emp.approvalStatus?.toLowerCase() === selectedStatus.toLowerCase()
      );
    }
  }

  setFilteredTableData(filtered);
}, [
  searchTerm,
  selectedDepartment,
  selectedDesignation,
  selectedStatus,
  tableData,
]);

  return (
    <>
      <header className="grid grid-cols-12 gap-4 px-4 mt-4">
        {/* Search */}
        <div className="search-container flex items-center gap-1 px-3 rounded-lg border border-gray-300 col-span-3">
          <Search className="text-gray-500" />
          <input
            type="text"
            placeholder="Search by Name or Employee ID"
            className="py-2 w-[100%] px-2 text-lg outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Department filter */}
        <div
          ref={department_modal}
          className="department-dropdown relative border border-gray-300 col-span-2 rounded-lg flex"
        >
          <div
            onClick={() => setDepartmentFilter(!departmentFilter)}
            className="filter-container flex px-2 cursor-pointer items-center justify-between w-[100%] gap-4"
          >
            <h1 className="text-gray-700 capitalize">
              {selectedDepartment === "all" ? "Department" : selectedDepartment}
            </h1>
            <ChevronDown
              className={`text-gray-600 transition-all duration-300 ${
                departmentFilter ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>
          {departmentFilter && (
            <div className="filter-dropdown z-20 bg-white shadow-lg w-[100%] py-2 border border-gray-200 absolute top-full left-0 rounded-md h-[240px] overflow-auto">
              {["all", "AI & ML", "AI & Ds", "CSE", "ECE", "IT", "MECH"].map(
                (dept) => (
                  <button
                    key={dept}
                    onClick={() => {
                      setSelectedDepartment(dept);
                      setDepartmentFilter(false);
                    }}
                    className="py-2 px-4 cursor-pointer hover:bg-gray-100 w-[100%] text-left capitalize"
                  >
                    {dept}
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {/* Designation filter */}
        <div
          ref={designation_modal}
          className="department-dropdown relative border border-gray-300 col-span-2 rounded-lg flex px-2"
        >
          <div
            onClick={() => setDesignationDropdown(!designationDropdown)}
            className="filter-container cursor-pointer flex items-center justify-between w-[100%] gap-4"
          >
            <h1 className="text-gray-700 capitalize">
              {selectedDesignation === "all"
                ? "Designation"
                : selectedDesignation}
            </h1>
            <ChevronDown
              className={`text-gray-600 transition-all duration-300 ${
                designationDropdown ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>
          {designationDropdown && (
            <div className="filter-dropdown z-20 bg-white shadow-lg w-[100%] py-2 border border-gray-200 absolute top-full left-0 rounded-md overflow-auto">
              {[
                "all",
                "Assistant Professor",
                "Associate Professor",
                "Professor",
              ].map((des) => (
                <button
                  key={des}
                  onClick={() => {
                    setSelectedDesignation(des);
                    setDesignationDropdown(false);
                  }}
                  className="py-2 px-4 cursor-pointer text-sm hover:bg-gray-100 w-[100%] text-left capitalize"
                >
                  {des}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* status-container  */}
        <div
          ref={statusDropdownref}
          className="status-container cursor-pointer  w-[100%]  relative border border-gray-300 col-span-3 rounded-lg"
        >
          <div
            onClick={() => setStatusDripdown(!statusDropdpwn)}
            className="header px-2 flex items-center justify-between w-[100%] h-[100%]"
          >
            <h1 className="text-gray-700 capitalize">
              {selectedStatus.toLowerCase() == "all"
                ? "Status"
                : selectedStatus}
            </h1>
            <ChevronDown
              className={`text-gray-600 transition-all duration-300 ${
                statusDropdpwn ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>
          {statusDropdpwn && (
            <div className="status-container w-[100%] bg-white shadow-lg z-20 rounded absolute top-full left-0">
              <button
                onClick={() => {
                  setSelectedStatus("All");
                  setStatusDripdown(false);
                }}
                className="w-full text-left px-2 py-2 cursor-pointer hover:bg-gray-100"
              >
                All
              </button>

              <button
                onClick={() => {
                  setSelectedStatus("Pending");
                  setStatusDripdown(false);
                }}
                className="w-full text-left px-2 py-2 cursor-pointer hover:bg-gray-100"
              >
                Pending
              </button>

              <button
                onClick={() => {
                  setSelectedStatus("Pending with HOD");
                  setStatusDripdown(false);
                }}
                className="w-full text-left px-2 py-2 cursor-pointer hover:bg-gray-100"
              >
                Pending with HOD
              </button>

              <button
                onClick={() => {
                  setSelectedStatus("Pending with Academic Dean");
                  setStatusDripdown(false);
                }}
                className="w-full text-left px-2 py-2 cursor-pointer hover:bg-gray-100"
              >
                Pending with Academic Dean
              </button>

              <button
                onClick={() => {
                  setSelectedStatus("Pending with Research Dean");
                  setStatusDripdown(false);
                }}
                className="w-full text-left px-2 py-2 cursor-pointer hover:bg-gray-100"
              >
                Pending with Research Dean
              </button>

              <button
                onClick={() => {
                  setSelectedStatus("Pending with iqac Dean");
                  setStatusDripdown(false);
                }}
                className="w-full text-left px-2 py-2 cursor-pointer hover:bg-gray-100"
              >
                Pending with iqac Dean
              </button>

              <button
                onClick={() => {
                  setSelectedStatus("Approved");
                  setStatusDripdown(false);
                }}
                className="w-full text-left px-2 py-2 cursor-pointer hover:bg-gray-100"
              >
                Approved
              </button>
            </div>
          )}
        </div>
        <button
          onClick={handleOverallDownload}
          className="bg-teal-700 flex items-center justify-center gap-3 text-white col-span-2 rounded-lg cursor-pointer hover:bg-teal-800"
        >
          <Download />
          Download
        </button>
      </header>
      {console.log("table data : ", filteredTableData)}
      {/* ✅ use filteredTableData */}
      <HrTableData tableData={filteredTableData} />
      {loading && <LoadingScreen/>}
    </>
  );
};

export default HrTable;
