import { useEffect, useState } from "react";
import { Data } from "./store.js";
import { filter, form } from "motion/react-client";
import { ConstructionIcon } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const DataProvider = ({ children }) => {
  const API = import.meta.env.VITE_API
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [researchPoints, setResearchPoints] = useState(null);
   const [servicePoints, setServicePoints] = useState(null);
  const [canditateData, setCandidateData] = useState({});
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQueryTable, setSearchQueryTable] = useState("");
  const [forms, setForms] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filteredTableData, setFilteredTableData] = useState([]);
  const [notVerifiedFilter, setNotVerifiedFilter] = useState("all");
  const [verifedData, setVerifiedData] = useState([]);
  const [filteredVerifiedData, setFilteredVerifiedData] = useState([]);
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
   const [showServicePreview, setSerivePreview] = useState(false);
  const token = localStorage.getItem("appraisal_token");

  // console.log("table data  ==> : ", tableData);

  // Fetch employees
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("appraisal_token");
      const response = await axios.get(`${import.meta.env.VITE_API}/api/tableData`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("table data : ", response.data);
      setTableData(response.data);
      setFilteredTableData(response.data);
      console.log("table data : ", response.data)
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // filtering logic
  useEffect(() => {
    let data = [...tableData];

    if (selectedStatus) {
      data = data.filter((emp) => emp.formStatus === selectedStatus);
    }

    if (selectedDesignation) {
      data = data.filter((emp) => emp.designation === selectedDesignation);
    }

    if (searchQueryTable) {
      const q = searchQueryTable.toLowerCase();
      data = data.filter(
        (emp) =>
          emp.fullName.toLowerCase().includes(q) ||
          emp.email.toLowerCase().includes(q) ||
          emp.designation.toLowerCase().includes(q)
      );
    }

    setFilteredTableData(data);
  }, [selectedStatus, selectedDesignation, searchQueryTable, tableData]);
  // functions
  const handleFilter = (filterItem) => {
    if (filterItem === "all") {
      setFilteredData(forms);
      setNotVerifiedFilter("all");
      setFilteredVerifiedData(verifedData);
      return;
    }

    const filtered = forms.filter(
      (item) =>
        (item.employee?.designation || "").toLowerCase() ===
        filterItem.toLowerCase()
    );

    const verifiedFilter = verifedData.filter(
      (item) =>
        (item.employee?.designation || "").toLowerCase() ===
        filterItem.toLowerCase()
    );
    console.log("hello : ", verifiedFilter);
    setFilteredVerifiedData(verifiedFilter);
    setFilteredData(filtered);
    setNotVerifiedFilter(filterItem);
  };

  // not verified search functionality
  const handleSearch = () => {
    if (searchQuery == "") {
      setFilteredData(forms);
      setFilteredVerifiedData(verifedData);
      return;
    }
    console.log(`search query : ${searchQuery}`);
    const filtered = forms.filter((item, index) =>
      item.employee?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const verified_filtered = verifedData.filter((item, index) =>
      item.employee?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    console.log("verified_filtered : ", verified_filtered);
    setFilteredData(filtered);
    setFilteredVerifiedData(verified_filtered);
  };

  // useEffect calls ==========================>

  // not verified search functionality
  useEffect(() => {
    handleSearch();
  }, [forms, searchQuery]);

  console.log("research points : ", researchPoints);
  return (
    <Data.Provider
      value={{
        canditateData,
        setCandidateData,
        activeTab,
        setActiveTab,
        searchQuery,
        filteredData,
        setSearchQuery,
        forms,
        setForms,
        notVerifiedFilter,
        setNotVerifiedFilter,
        handleFilter,
        verifedData,
        setVerifiedData,
        filteredVerifiedData,
        selectedStatus,
        setSelectedStatus,
        searchQueryTable,
        filteredTableData,
        setSelectedDesignation,
        // selectedStatus,
        // setSelectedStatus,
        setSearchQueryTable,
        selectedDesignation,
        setResearchPoints,
        researchPoints,
        setServicePoints,
         setSerivePreview,
        servicePoints,
        selectedRows, setSelectedRows
      }}
    >
      {children}
    </Data.Provider>
  );
};
