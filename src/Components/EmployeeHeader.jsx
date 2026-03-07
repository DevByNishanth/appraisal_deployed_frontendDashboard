import { useContext, useEffect, useState } from "react";
import { ChevronDown, CheckCircle, Clock, Search } from "lucide-react";
import clock_icon from "../assets/clock-icon.svg";
import verify_black_icon from "../assets/verify_black_icon.svg";
import { Data } from "../Context/store.js";
import { jwtDecode } from "jwt-decode";
// import { Data } from "../Context/store.js";
const EmployeeHeader = ({ needToVerifyCount, verifiedCount, setSelectedTab }) => {
  // Authentication Data
const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const username = decoded.facultyName;
  // states 
  const [active, setActive] = useState("need");
  const [isFilter, setIsFilter] = useState(false)
  // context API data 
  const { searchQuery, setSearchQuery, setNotVerifiedFilter, handleFilter } = useContext(Data)

  // useEffect calls 
  useEffect(() => {
    if (active == "need") {
      setSelectedTab("needToBeVerified")
    } else {
      setSelectedTab("verified")
    }
  }, [active])
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-md">
        {/* Tabs Section */}
        <div className="flex gap-3">
          <button
            onClick={() => setActive("need")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold  ${active === "need"
              ? "bg-[#2986CE] text-white font-semibold"
              : "bg-gray-100 text-gray-700"
              }`}
          >
            {active == "need" ? <img src={clock_icon} /> : ""}
            {/* Need to be verified (30) */}
            <p>Need to be verified <span>({needToVerifyCount})</span></p>
          </button>
          <button
            onClick={() => setActive("verified")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm ${active === "verified"
              ? "bg-[#2986CE] text-white font-semibold"
              : "bg-gray-100 text-black font-semibold"
              }`}
          >
            {active == "verified" ? "" : <img src={verify_black_icon} />}
            Verified ({verifiedCount})
          </button>
        </div>

        {/* Search & Filter Section */}
        <div className="flex gap-3">
          <div className="search-container border border-gray-300 rounded-lg flex items-center gap-2 w-[240px] px-2">
            <Search className="text-gray-500" />
            <input
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Search Employees"
              className="py-2 text-sm focus:outline-none w-[100%]"
            />
          </div>
          <button className="flex items-center relative justify-between border border-gray-300 rounded-lg px-4 py-2 text-sm gap-2 w-[140px]">
            Filter by <ChevronDown onClick={() => setIsFilter(!isFilter)} size={22} className={`${isFilter ? "rotate-180" : ""} cursor-pointer transition-all duration-300 `} />
            {isFilter && <div className="dropdown-container w-[160px] shadow-2xl rounded-lg absolute top-full right-0 bg-white">
              <button onClick={() => { handleFilter("all"); setIsFilter(false) }} className="filter-btn w-full hover:bg-[#318179] hover:text-white cursor-pointer text-left py-2 px-4 hover:rounded-t-lg ">All</button>
              <button onClick={() => { handleFilter("assistant professor"); setIsFilter(false) }} className="filter-btn w-full hover:bg-[#318179] hover:text-white cursor-pointer text-left py-2 px-4 ">Assistant Professor</button>
              <button onClick={() => { handleFilter("associate professor"); setIsFilter(false) }} className="filter-btn w-full hover:bg-[#318179] hover:text-white cursor-pointer text-left py-2 px-4 ">Associate Professor</button>
              <button onClick={() => { handleFilter("professor"); setIsFilter(false) }} className="filter-btn w-full hover:bg-[#318179] hover:text-white cursor-pointer text-left py-2 px-4 hover:rounded-b-lg"> Professor</button>
            </div>}
          </button>
        </div>
      </div>
    </>
  );
};

export default EmployeeHeader;
