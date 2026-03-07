import React, { useContext, useState } from "react";
import axios from "axios";
import { Download } from "lucide-react";
import no_data from "../assets/no_data_found.jpg";
import { Data } from "../Context/store.js";
import LoadingScreen from "../Pages/LoadingSceen";

const tableHeader = [
  "Name",
  "Emp Id",
  "Mail Id",
  "Phone",
  "Department",
  "Designation",
  "Status",
  "Action",
];

const HrTableData = ({ tableData }) => {
  const { selectedRows, setSelectedRows } = useContext(Data);
  console.log("selected roles : ", selectedRows);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  // Toggle select all

  // const handleSelectAll = () => {
  //   if (selectAll) {
  //     setSelectedRows([]);
  //   } else {
  //     setSelectedRows(tableData.map((item, idx) => item.formId));
  //   }
  //   setSelectAll(!selectAll);
  // };

  const handleSelectAll = () => {
    if (selectAll) {
      // Unselect all rows
      setSelectedRows([]);
    } else {
      // Select all submitted forms
      const submittedRows = tableData
        .filter((item) => item.approvalStatus.toLowerCase() == "approved")
        .map((item) => item.formId);

      setSelectedRows(submittedRows);
    }

    // Toggle the selectAll state
    setSelectAll(!selectAll);
  };

  // Toggle single row
  const handleRowSelect = (formId) => {
    if (selectedRows.includes(formId)) {
      setSelectedRows(selectedRows.filter((i) => i !== formId));
    } else {
      setSelectedRows([...selectedRows, formId]);
    }
  };

  // ✅ Corrected API download handler
  const handleDownload = async (formId) => {
    setLoading(true);
    try {
      console.log("Downloading PDF for ID:", formId);

      const response = await axios.get(
        `${import.meta.env.VITE_API}/api/getPdf/${formId}`,
        {
          responseType: "blob", // important for PDF files
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `faculty_appraisal_${formId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setLoading(false);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="table-container w-full mt-4 px-4 max-h-[calc(100vh-200px)] overflow-auto">
        <table className="w-full border border-gray-200">
          <thead className="bg-teal-600 text-white sticky top-[-1px] z-10">
            <tr>
              <th className="py-2 px-2">
                <input
                  className="scale-125 accent-white"
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              {tableHeader.map((item, index) => (
                <td key={index} className="py-2 px-2 text-left font-semibold">
                  {item}
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData?.map((row, index) => (
              <tr
                key={index}
                className="border-b border-gray-300 text-[#333333]"
              >
                <td className="py-2">
                  {row.approvalStatus.toLowerCase() == "approved" ? (
                    <input
                      type="checkbox"
                      className="scale-125 ml-4 accent-teal-600"
                      checked={selectedRows?.includes(row.formId)}
                      onChange={() => handleRowSelect(row.formId)}
                    />
                  ) : (
                    ""
                  )}
                </td>

                <td className="py-2 px-2">{row.fullName}</td>
                <td className="py-2 px-2">{row.employeeId}</td>
                <td className="py-2 px-2">{row.email}</td>
                <td className="py-2 px-2">{row.phone_number}</td>
                <td className="py-2 px-2">{row.department}</td>
                <td className="py-2 px-2">{row.designation}</td>
                {/* <td className="py-2 px-2">{row.approvalStatus}</td> */}
                <td className="py-2 px-2">
                  <div
                    className={`${
                      row.approvalStatus.toLowerCase() == "approved"
                        ? "bg-green-300 text-black py-2 rounded  "
                        : "bg-red-300 text-black py-2 rounded "
                    } text-sm w-fit px-4 text-center`}
                  >
                    <h1>{row.approvalStatus}</h1>
                  </div>
                </td>

                {/* ✅ Pass correct formId */}
                <td className="py-2 px-2">
                  {row.approvalStatus.toLowerCase() !== "approved" ? (
                    <button className="text-teal-600 cursor-not-allowed">
                      <Download />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDownload(row.formId)}
                      className="text-teal-600 cursor-pointer"
                    >
                      <Download />
                    </button>
                  )}
                </td>

                <td className="py-2 px-2">
                  {row.isSubmitted == "Yes" ? (
                    <button
                      onClick={() => handleDownload(row.formId)}
                      className="text-teal-600 cursor-pointer"
                    >
                      <Download />
                    </button>
                  ) : (
                    ""
                  )}
                </td>
              </tr>
            ))}
          </tbody>

          {tableData.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-6 text-gray-500">
                <div>
                  <img
                    src={no_data}
                    className="h-[140px] w-[140px] m-auto object-cover"
                  />
                  <h1>No employees found</h1>
                </div>
              </td>
            </tr>
          )}
        </table>
      </div>
      {loading && <LoadingScreen />}
    </>
  );
};

export default HrTableData;
