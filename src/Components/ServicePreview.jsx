import React, { useEffect, useState, useRef, useContext } from "react";
import { X, ChevronsRight } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Data } from "../Context/store.js";
import { useNavigate } from "react-router-dom";

export default function ServicePreview({ data, setShowPreview, form_id }) {
  const API = import.meta.env.VITE_API;
  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);

  // User details
  const designation = decoded.designation;
  const username = decoded.facultyName;
  const department = decoded.department;
  const email = decoded.email;
  const emp_id = decoded.id;

  const [designationuser, setDesignationuser] = useState();
  const [name, setName] = useState();
  const [previewmark, setPreviewmark] = useState(null);

  const navigate = useNavigate();
  // ✅ Only keep what exists in context
  // const { setIsSubmitted } = useContext(Data);

  const previewRef = useRef();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // ✅ Fix: role check with lowercase
  const handleApproval = () => {
    console.log("handle approval running ");
    const role = designation?.toLowerCase();
    console.log("role : ", role);
    if (role.includes("hod")) {
      approveByHOD(form_id);
    } else if (role.includes("dean")) {
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
        { headers: { Authorization: `Bearer ${token}` } },
      );
      console.log("HOD approval success:", response.data);
      navigate(`/appraisal_form/form/${form_id}/completed`);
    } catch (error) {
      console.error("Error approving by HOD:", error);
    }
  };

  // Approve by Dean
  const approveByDean = async (form_id) => {
    console.log("approve by Dean :--------> ");

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API}/api/serviceDean/${form_id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      console.log("Dean approval success:", response.data);
      navigate(`/appraisal_form/form/${form_id}/completed`);
    } catch (error) {
      console.error("Error approving by Dean:", error);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (previewRef.current && !previewRef.current.contains(event.target)) {
        setShowPreview(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowPreview]);

  useEffect(() => {
    if (!data) return;
    setDesignationuser(data.designation);
    setName(data.facultyName);

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
              Authorization: `Bearer ${localStorage.getItem(
                "appraisal_token",
              )}`,
              "Content-Type": "application/json",
            },
          },
        );
        setPreviewmark(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [data]);

  // // ✅ Submit handler (removed setFormCompleted)
  // const handleComplete = async () => {
  //   try {
  //     const response = await axios.put(
  //       `${import.meta.env.VITE_API}/api/submit/${emp_id}`
  //     );
  //     const status = response.data.employee.formStatus?.toLowerCase();
  //     console.log("status : ", status);
  //     if (status === "submitted") {
  //       handleApproval();
  //       // setIsSubmitted("Submitted");
  //     } else {
  //       console.error("error occured");
  //     }
  //   } catch (err) {
  //     console.error(err.message);
  //   }
  // };

  return (
    <>
      <div className="p-6">
        <div
          ref={previewRef}
          className="bg-white w-[90%] sm:w-[520px] rounded-lg shadow py-4 fixed z-[50] top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%]"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-3 pb-3 border-b px-4 border-gray-300">
            <h2 className="font-semibold text-lg">Service Performance</h2>
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

            <div className="space-y-1 px-3">
              {[
                [
                  "Accreditation Activities - NAAC, NBA, UGC, NIRF, AU",
                  previewmark?.record?.activities?.marks,
                ],
                [
                  "Branding of Institution ",
                  previewmark?.record?.branding?.marks,
                ],
                [
                  "Membership in Professional Bodies",
                  previewmark?.record?.membership?.marks,
                ],
                [
                  "Co-curricular and Extra-curricular Outreach Programme",
                  previewmark?.record?.external?.marks,
                ],
                [
                  "Assistance in General Administration",
                  previewmark?.record?.administration?.marks,
                ],
                [
                  "Organizing/Handling Training Programme for External",
                  previewmark?.record?.training?.marks,
                ],
              ].map(([label, marks], i) => (
                <p key={i} className="flex justify-between font-medium">
                  {label}: <span>{marks ?? 0}</span>
                </p>
              ))}
            </div>

            <div className="flex justify-between pt-2 font-semibold bg-gray-100">
              <div className="px-3 py-2 text-black">Total Marks</div>
              <h1 className="px-3">{previewmark?.serviceMarks ?? 0}</h1>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4 px-4">
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
      </div>
      <div className="tint fixed top-0 right-0 left-0 bottom-0"></div>
    </>
  );
}
