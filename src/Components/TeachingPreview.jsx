import React, { useEffect, useState, useRef, useContext } from "react";
import jsPDF from "jspdf";
import bulb from "../assets/bulb.svg";
import { X, ChevronsRight } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Data } from "../Context/store.js";
import { useNavigate, useParams } from "react-router-dom";
// import domtoimage from "dom-to-image-more";

export default function TeachingPreview({ data, setShowTeachingPreview }) {
  const previewRef = useRef(); // For the modal preview
  const pdfRef = useRef(); // For the hidden PDF content
  const navigate = useNavigate();
  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  // console.log("decoded", decoded);
  const designation = decoded.designation;
  const username = decoded.facultyName;
  const department = decoded.department;
  const email = decoded.email;
  const emp_id = decoded._id;

  const [designationuser, setDesignationuser] = useState();
  const [name, setName] = useState();
  console.log("name",name)
  const [id, setId] = useState();

  const [previewmark, setPreviewmark] = useState(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API}/api/teachingrecord`,
          {
            facultyName: data.facultyName,
            designation: data.designation,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
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
  }, [designationuser, name]);
  useEffect(() => {
    if (data) {
      setDesignationuser(data.designation);
      setName(data.facultyName);
      setId(data.employee._id);
    }
  }, [data]);

  const { form_id } = useParams();
  function handleResearchNavigation() {
    if (designation.toLowerCase() == "hod") {
      navigate(`/appraisal_form/form/${form_id}/research_form`);
    } else {
      navigate(`/appraisal_form/form/completed`);
    }
  }
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
      navigate(`/appraisal_form/form/${form_id}/research_form`);
    } catch (error) {
      console.error("Error approving by HOD:", error);
    }
  };

  // Approve by Dean
  const approveByDean = async (form_id) => {
    console.log("approve by Dean :--------> ");

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API}/api/academicDean/${form_id}`,
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
      <div className="p-6">
        {/* Main Modal Preview */}
        <div
          ref={previewRef}
          className="bg-white w-[90%] h-[95vh] sm:w-[70%] rounded-lg shadow py-4 fixed z-[50] top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%]"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-3 pb-3 border-b px-4 border-gray-300 ">
            <h2 className="font-semibold text-lg">Teaching Performance</h2>
            <button
              onClick={() => setShowTeachingPreview(false)}
              className="cursor-pointer hover:bg-gray-300 bg-gray-200 rounded-full p-1"
            >
              <X />
            </button>
          </div>

          {/* Table */}
          <div className="rounded-lg mx-4 h-[400px] overflow-auto border border-gray-300  ">
            <div className="flex justify-between items-center bg-[#edf7f5] border-b border-gray-200">
              <div className="px-3 py-2 font-medium">Title</div>
              <div className="px-3 py-2 font-medium">Marks</div>
            </div>

            <div className="space-y-1 px-3 md:h-[400px] overflow-auto">
              {[
                [
                  "Teaching Assignment",
                  previewmark?.record?.teachingAssignment?.marks,
                ],
                ["Pass Percentage", previewmark?.record?.passPercentage?.marks],
                [
                  "The Average Student Feedback for all Theory/Lab classes",
                  previewmark?.record?.feedback?.marks,
                ],
                [
                  "Implementing Innovative Approaches In Classroom Teaching and Laboratory Sessions",
                  previewmark?.record?.innovativeApproach?.marks,
                ],
                [
                  "Organizing Guest Lectures/Inviting Visiting Faculty for respective subjects",
                  previewmark?.record?.visitingFaculty?.marks,
                ],
                [
                  "Organizing Faculty Development Programs, Seminars, Workshops, and Conferences with funding",
                  previewmark?.record?.fdpFunding?.marks,
                ],
                [
                  "Involvement in High Level Competition/Innovative Projects ",
                  previewmark?.record?.innovationProject?.marks,
                ],
                [
                  "Faculty Development Programme attended, and Online course passed (AICTE/SWAYAM/Reputed HEI",
                  previewmark?.record?.fdp?.marks,
                ],
                [
                  "MoU Signed with Industries / Establishment of a Laboratory in Collaboration with an Industry / Involvement in CoE activities.",
                  previewmark?.record?.industry?.marks,
                ],
                [
                  "Tutor Ward Meeting ",
                  previewmark?.record?.tutorMeeting?.marks,
                ],
                [
                  "Academic Coordinator/ Class Advisor ",
                  previewmark?.record?.academicPosition?.marks,
                ],
              ].map(([label, marks], i) => (
                <p key={i} className="flex justify-between font-medium">
                  {label}: <span>{marks ?? 0}</span>
                </p>
              ))}
            </div>

            <div className="flex justify-between pt-2 font-semibold bg-gray-100">
              <div className="px-3 py-2 text-black">Total Marks</div>
              <h1 className="px-3">{previewmark?.teachingMarks ?? 0}</h1>
            </div>
          </div>

          <div className="bg-pink-50 text-[#ED6C83] text-[13px] flex gap-2 mx-4 rounded mt-3 px-3 py-2">
            <img src={bulb} className="w-6 h-6" alt="Note" />
            <span className="font-semibold">Note :</span> You can't edit the
            form once you click Submit button
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4 px-4">
            <button
              onClick={() => {
                // handleResearchNavigation();
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
          {/* Header */}
          <div className="flex justify-between items-start">
            <img src="/logo.png" alt="Logo" className="w-32 h-auto" />

            <div className="text-right text-sm">
              <p className="font-bold">ORGANISATION DETAILS :</p>
              <p>Sri Eshwar College of Engineering</p>
              <p>366, Sector 4, Rewari, Haryana, India</p>
            </div>
          </div>

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
          <table className="w-full mt-6 border-collapse text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left">Questions</th>
                <th className="border p-2 text-right">Marks</th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "Teaching Assignment",
                  previewmark?.record?.teachingAssignment?.marks,
                ],
                ["Pass Percentage", previewmark?.record?.passPercentage?.marks],
                [
                  "The Average Student Feedback for all Theory/Lab classes",
                  previewmark?.record?.feedback?.marks,
                ],
                [
                  "Implementing Innovative Approaches In Classroom Teaching and Laboratory Sessions",
                  previewmark?.record?.innovativeApproach?.marks,
                ],
                [
                  "Organizing Guest Lectures/Inviting Visiting Faculty for respective subjects",
                  previewmark?.record?.visitingFaculty?.marks,
                ],
                [
                  "Organizing Faculty Development Programs, Seminars, Workshops, and Conferences with funding",
                  previewmark?.record?.fdpFunding?.marks,
                ],
                [
                  "Involvement in High Level Competition/Innovative Projects ",
                  previewmark?.record?.innovationProject?.marks,
                ],
                [
                  "Faculty Development Programme attended, and Online course passed (AICTE/SWAYAM/Reputed HEI",
                  previewmark?.record?.fdp?.marks,
                ],
                [
                  "MoU Signed with Industries / Establishment of a Laboratory in Collaboration with an Industry / Involvement in CoE activities.",
                  previewmark?.record?.industry?.marks,
                ],
                [
                  "Tutor Ward Meeting ",
                  previewmark?.record?.tutorMeeting?.marks,
                ],
                [
                  "Academic Coordinator/ Class Advisor ",
                  previewmark?.record?.academicPosition?.marks,
                ],
              ].map(([label, marks], i) => (
                <tr key={i}>
                  <td className="border p-2">{label}</td>
                  <td className="border p-2 text-right">{marks ?? 0}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="border p-2 font-bold">Total Marks</td>
                <td className="border p-2 text-right font-bold">
                  {previewmark?.totalMarks ?? 0}
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
