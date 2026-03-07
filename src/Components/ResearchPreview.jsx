import React, { useEffect, useState, useRef, useContext } from "react";
import jsPDF from "jspdf";
import bulb from "../assets/bulb.svg";
import { X, ChevronsRight } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Data } from "../Context/store.js";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";

export default function ResearchPreview({
  dataResearch,
  setShowPreview,
  form_id,
}) {
 const API = import.meta.env.VITE_API
  const previewRef = useRef(); // For the modal preview
  const pdfRef = useRef(); // For the hidden PDF content

  const navigate = useNavigate();
  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  console.log("decoded", decoded);
  const designation = decoded.designation;
  const username = decoded.facultyName;
  const department = decoded.department;
  const email = decoded.email;
  const emp_id = decoded._id;
  const [designationuser, setDesignationuser] = useState();
  const [name, setName] = useState();

  const { setshowPreviewForm1, setSelectedTab, setShowPreviewResearch } =
    useContext(Data);
  const [previewmark, setPreviewmark] = useState(null);

  console.log("dataResearch : ", dataResearch);

  useEffect(() => {
    if (!dataResearch) return;

    // Set values from props
    setDesignationuser(dataResearch.designation);
    setName(dataResearch.facultyName);

    // Fetch data after setting values
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API}/api/teachingrecord`,
          {
            facultyName: dataResearch.facultyName,
            designation: dataResearch.designation,
            // employeeId: dataResearch.employee?._id, // include ID if needed
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "appraisal_token"
              )}`,
              "Content-Type": "application/json",
            },
          }
        );
        setPreviewmark(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dataResearch]);
  // ✅ Fix: role check with lowercase
  const handleApproval = () => {
    console.log("handle approval running ");
    const role = designation?.toLowerCase();
    console.log("role : ", role);
    if (role.toLowerCase() === "hod") {
      approveByHOD(form_id);
    } else if (role === "dean") {
      approveByDean(form_id);
    }
  };

  // Approve by HOD
  const approveByHOD = async (form_id) => {
    console.log("approve by hod : ", "running");
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API}/api/approvehod/${form_id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("HOD approval success:", response.data);
      navigate(`/appraisal_form/form/${form_id}/service_form`);
    } catch (error) {
      console.error("Error approving by HOD:", error);
    }
  };

  // Approve by Dean
  const approveByDean = async (form_id) => {
    console.log("approve by Dean :--------> ");

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API}/api/researchDean/${form_id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Dean approval success:", response.data);
      navigate(`/appraisal_form/form/${form_id}/completed`);
    } catch (error) {
      console.error("Error approving by Dean:", error);
    }
  };

  return (
    <>
      <div className="p-6 ">
        {/* Main Modal Preview */}
        <div
          ref={previewRef}
          className="bg-white w-[90%] h-[95vh] sm:w-[70%] rounded-lg shadow py-4 fixed z-[50] top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%]"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-3 pb-3 border-b px-4 border-gray-300">
            <h2 className="font-semibold text-lg">Research Performance</h2>
            <button
              onClick={() => setShowPreview(false)}
              className="cursor-pointer hover:bg-gray-300 bg-gray-200 rounded-full p-1"
            >
              <X />
            </button>
          </div>

          {/* Table */}
          <div className="rounded-lg overflow-hidden mx-4 border border-gray-300">
            <div className="flex justify-between items-center bg-[#edf7f5] border-b border-gray-200">
              <div className="px-3 py-2 font-medium">Title</div>
              <div className="px-3 py-2 font-medium">Marks</div>
            </div>

            <div className="space-y-1 px-3 lg:h-[280px] overflow-auto">
              {[
                [
                  "Papers Published in SCIE/SSCI/AHCI Indexed Journals",
                  previewmark?.record?.sciePaper?.marks,
                ],
                [
                  "Papers Published in Scopus/ESCI/WoS Indexed Journals. ",
                  previewmark?.record?.scopusPaper?.marks,
                ],
                [
                  "Papers Published in AICTE/UGC Care list Indexed Journals ",
                  previewmark?.record?.aictePaper?.marks,
                ],
                [
                  "Book Published in Scopus/WoS indexed Series",
                  previewmark?.record?.scopusBook?.marks,
                ],
                [
                  "Papers Published in Scopus/Wos Indexed Book Chapters/Conference Proceedings",
                  previewmark?.record?.indexBook?.marks,
                ],
                // ["Patent Published ,Utility Patents Granted –,Design and others", previewmark?.record?.patent?.marks],
                ["Increase in h - Index ", previewmark?.record?.hIndex?.marks],
                [
                  "Increase in l 10 - Index",
                  previewmark?.record?.iIndex?.marks,
                ],
                ["Increase in Citations", previewmark?.record?.citation?.marks],
                [
                  "Funded Project Min 5L",
                  previewmark?.record?.fundedProject?.marks,
                ],
                [
                  "Consultancy Work Certified by the Industries",
                  previewmark?.record?.consultancy?.marks,
                ],
                [
                  "Collaborative Work With Foreign Universities",
                  previewmark?.record?.collabrative?.marks,
                ],
                ["Seed fund Activities", previewmark?.record?.seedFund?.marks],
              ].map(([label, marks], i) => (
                <p key={i} className="flex justify-between font-medium">
                  {label}: <span>{marks ?? 0}</span>
                </p>
              ))}
            </div>

            <div className="flex justify-between pt-2 font-semibold bg-gray-100">
              <div className="px-3 py-2 text-black">Total Marks</div>
              <h1 className="px-3">{previewmark?.researchMarks ?? 0}</h1>
            </div>
          </div>

          {/* Note */}
          <div className="bg-pink-50 text-[#ED6C83] text-[13px] flex gap-2 mx-4 rounded mt-3 px-3 py-2">
            <img src={bulb} className="w-6 h-6" alt="Note" />
            <span className="font-semibold">Note :</span> You can't edit the
            form once you click Submit button
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4 px-4">
            {/* <Link
              to={`/appraisal_form/form/${form_id}/service_form`}
              className="bg-[#318179] text-white px-6 py-2 rounded hover:bg-[#21645d] text-sm flex items-center gap-1"
            >
              
              
              Submit <ChevronsRight />
            </Link> */}
            <button
              onClick={() => {
                // handleComplete();
                handleApproval();
              }}
              className="bg-[#318179] text-white px-6 py-2 rounded hover:bg-[#21645d] text-sm flex items-center gap-1"
            >
              Submit <ChevronsRight />
            </button>
          </div>
        </div>

        {/* Hidden PDF Content (always mounted off-screen) */}
        <div
          ref={pdfRef}
          style={{ position: "absolute", left: "-9999px", top: 0 }}
          className="w-[800px] bg-white p-6"
        >
          <div className="flex justify-between items-start">
            <img src="/logo.png" alt="Logo" className="w-32 h-auto" />

            <div className="text-right text-sm">
              <p className="font-bold">ORGANISATION DETAILS :</p>
              <p>Sri Eshwar College of Engineering</p>
              <p>366, Sector 4, Rewari, Haryana, India</p>
            </div>
          </div>

          {/* Employee Info */}
          {/* Employee Info */}
          <div className="border border-gray-400 p-3 mt-4 space-y-2 text-sm">
            <div>
              <span className="font-bold border border-black px-1 bg-gray-200">
                Name :
              </span>{" "}
              {username}
            </div>
            <div>
              <span className="font-bold border border-black px-1 bg-gray-200">
                Email ID :
              </span>{" "}
              {email}
            </div>
            <div>
              <span className="font-bold border border-black px-1 bg-gray-200">
                Employee ID :
              </span>{" "}
              {emp_id || 12345}
            </div>
            <div>
              <span className="font-bold border border-black px-1 bg-gray-200">
                Department :
              </span>{" "}
              {department}
            </div>
            <div>
              <span className="font-bold border border-black px-1 bg-gray-200">
                Designation :
              </span>{" "}
              {designation}
            </div>
          </div>

          {/* Table */}
          <table className="w-full mt-4 border-collapse border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left">Questions</th>
                <th className="border p-2 text-right">Marks</th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "Papers Published in SCIE / SSCI / AHCI",
                  previewmark?.record?.sciePaper?.marks,
                ],
                [
                  "Papers Published in Scopus / ESCI / WoS",
                  previewmark?.record?.scopusPaper?.marks,
                ],
                [
                  "Papers Published in AICTE/UGC Care list",
                  previewmark?.record?.aictePaper?.marks,
                ],
                [
                  "Book Published in Scopus / WoS Indexed Series",
                  previewmark?.record?.scopusBook?.marks,
                ],
                [
                  "Papers Published in Scopus / WoS Indexed Book Chapters",
                  previewmark?.record?.indexBook?.marks,
                ],
                ["Patent Published", previewmark?.record?.patent?.marks],
                ["Increase in h - Index", previewmark?.record?.hIndex?.marks],
                [
                  "Increase in i 10 - Index",
                  previewmark?.record?.iIndex?.marks,
                ],
                ["Increase in Citations", previewmark?.record?.citation?.marks],
                [
                  "Funded Project Min 5L",
                  previewmark?.record?.fundedProject?.marks,
                ],
                [
                  "Consultancy Work Certified by the Industries",
                  previewmark?.record?.consultancy?.marks,
                ],
                [
                  "Collaborative Work With Foreign Universities",
                  previewmark?.record?.collabrative?.marks,
                ],
                ["Seed fund Activities", previewmark?.record?.seedFund?.marks],
              ].map(([label, marks], i) => (
                <tr key={i}>
                  <td className="border p-2">{label}</td>
                  <td className="border p-2 text-right">{marks ?? 0}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-bold">
                <td className="border p-2">Total Marks</td>
                <td className="border p-2 text-right">
                  {previewmark?.researchMarks ?? 0}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Footer */}
          <div className="text-center mt-6 bg-teal-700 text-white p-2 text-xs">
            All rights reserved by @Quantum Pulse Technology
          </div>
        </div>
      </div>
      <div className="tint fixed top-0 right-0 left-0 bottom-0"></div>
    </>
  );
}
