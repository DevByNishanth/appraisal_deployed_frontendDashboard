import React, { useEffect, useRef, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import axios from "axios";
import { ChevronDown } from "lucide-react";

const COLORS = [
  "#ffb998",
  "#c2b5ff",
  "#86c7cc",
  "#b6e4ca",
];

export default function CustomPieChart() {
  const [pieChartData, setPieChartData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [selectedDept, setSelectedDept] = useState("CCE");
  const [filterDropdown, setFilterDropdown] = useState(false);

  const dropdownRef = useRef(null);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleOutSideclick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setFilterDropdown(false);
      }
    };
    document.addEventListener("click", handleOutSideclick);
    return () => document.removeEventListener("click", handleOutSideclick);
  }, []);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API}/api/peiChart`);

        // Flatten nested designations array
        const mappedData = response.data.flatMap((dept) =>
          dept.designations.map((desig) => ({
            name: `${desig.designation} (${dept.department})`,
            designation: desig.designation,
            department: dept.department,
            value: desig.count,
          }))
        );

        setAllData(mappedData);
        setPieChartData(mappedData); // Default: all
      } catch (error) {
        console.error("Error fetching pie chart data:", error);
      }
    };

    fetchData();
  }, []);




const handleFilterChange = (dept) => {
  setSelectedDept(dept);
  setFilterDropdown(false);

  if (dept === "All") {
    setPieChartData(allData);
  } else {
    const filtered = allData.filter((item) => item.department === dept);
    setPieChartData(filtered);
  }
};

// 🔹 Automatically call CCE filter on mount or when data updates
useEffect(() => {
  if (allData && allData.length > 0) {
    handleFilterChange("CCE");
  }
}, [allData]);


  // Get department list dynamically
  const departmentList = [...new Set(allData.map((item) => item.department))];
  console.log("dept list : ", departmentList);

  return (
    <div className="w-full h-[450px] flex flex-col items-center">
      {/* Department Filter */}
      <div className="w-full flex justify-end px-4 pt-2">
        <div
          ref={dropdownRef}
          className="relative w-[40%] border border-gray-300 rounded px-3 py-2"
        >
          {/* Dropdown header */}
          <div
            onClick={() => setFilterDropdown(!filterDropdown)}
            className="flex items-center justify-between cursor-pointer"
          >
            <h1 className="font-medium text-gray-700">{selectedDept}</h1>
            <ChevronDown
              className={`text-gray-600 transition-all duration-300 ${
                filterDropdown ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* Dropdown menu */}
          {filterDropdown && (
            <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded mt-1 shadow z-20">
              {departmentList.map((dept, idx) => (
                <button
                  key={idx}
                  onClick={() => handleFilterChange(dept)}
                  className={`w-full text-left px-3 py-2 hover:bg-teal-600 hover:text-white ${
                    selectedDept === dept ? "bg-gray-300 text-white" : ""
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pie Chart */}
      <div className="w-full h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              dataKey="value"
              data={pieChartData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {pieChartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={60} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
