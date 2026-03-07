import React, { useEffect, useState } from "react";
import axios from "axios";
import completedImg from "../assets/completedImg.svg";
import Sidebar from "../Components/Sidebar";
import AppraisalFormComponentHeader from "../Components/AppraisalFormComponentHeader";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ThanksPage = () => {
  const [teachingMarks, setTeachingMarks] = useState(0);
  const [researchMarks, setResearchMarks] = useState(0);
  const [serviceMarks, setServiceMarks] = useState(0);
  const [totalMarks, setTotalMarks] = useState(0);

  const [designationuser, setDesignationuser] = useState("");

  const [candidateName, setCandidateName] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const designation = decoded.designation;
  const mail = decoded.email;
  const API = import.meta.env.VITE_API;
  const { form_id } = useParams();

  // ✅ Fetch joinAnswer
  const fetchJoinAnswer = async () => {
    try {
      console.log("Calling API with form_id:", form_id);
      const res = await axios.get(`${API}/api/joinAnswer/${form_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("JoinAnswer Response:", res.data);

      setData(res.data);
      setCandidateName(res.data?.facultyName || "");
      setDesignationuser(res.data?.employee?.designation || "");
    } catch (err) {
      console.error("API error:", err);
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch points only when we have candidateName & designationuser
  const fetchPoints = async (name, designation) => {
    try {
      const response = await axios.post(
        `${API}/api/teachingrecord`,
        {
          facultyName: name,
          designation: designation,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      console.log(
        "TeachingRecord Response:-------->",
        response.data.researchMarks,
      );

      setTeachingMarks(response.data.teachingMarks || 0);
      setResearchMarks(response.data.researchMarks || 0);
      setServiceMarks(response.data.serviceMarks || 0);
      setTotalMarks(response.data.totalMarks || 0);
    } catch (error) {
      console.error(
        "Error fetching points:",
        error.response?.data || error.message,
      );
    }
  };

  // ✅ Run once → get joinAnswer
  useEffect(() => {
    fetchJoinAnswer();
  }, []);

  // ✅ When candidateName & designationuser update → fetch points
  useEffect(() => {
    if (candidateName && designationuser) {
      fetchPoints(candidateName, designationuser);
    }
  }, [candidateName, designationuser]);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-600">Error: {error}</p>;
  }

  return (
    <main>
      <section className="grid grid-cols-12">
        <div className="sidebar-container col-span-2">
          <Sidebar />
        </div>
        <div className="col-span-10">
          <AppraisalFormComponentHeader />
          <div className="main-container">
            <div className="img-container pt-4">
              <img
                src={completedImg}
                className="w-[220px] h-[140px] m-auto"
                alt="Completed"
              />
            </div>
            <div className="text-container text-center mt-4 w-fit m-auto">
              <h1 className="text-[#318179] text-xl font-semibold">
                Thank You for Reviewing!
              </h1>
              <p className="text-gray-600 mt-2 text-base w-[80%] m-auto">
                Your review has been recorded successfully. You may close this
                page or return to the dashboard to continue.
              </p>
            </div>
          </div>

          {/* ✅ Table with dynamic state values */}
          <table className="w-[440px] rounded m-auto mt-4 border border-gray-300 text-sm  overflow-hidden ">
            <thead className="bg-[#A3D9CE]">
              <tr>
                <th className="p-3 text-left">Performance</th>
                <th className="p-3 text-left">Marks</th>
              </tr>
            </thead>
            <tbody>
              {console.log(`mail: ${mail}  Designation: "${designation}"`)}

              {/* Teaching Performance for HOD */}
              {(mail === "deanacademics@sece.ac.in" ||
                designation.trim().includes("hod")) && (
                <tr className="bg-gray-50 border-b border-gray-300">
                  <td className="py-2 pl-2">Teaching Performance</td>
                  <td>{teachingMarks}</td>
                </tr>
              )}

              {/* Research only for Dean */}
              {(mail === "deanresearch@sece.ac.in" ||
                designation.trim().includes("hod")) && (
                <tr className="bg-gray-50 border-b border-gray-300">
                  <td className="py-2 pl-2">Research</td>
                  <td>{researchMarks}</td>
                </tr>
              )}

              {/* Service for HOD or IQAC Dean */}
              {(mail === "deaniqac@sece.ac.in" ||
                designation.trim().includes("hod")) && (
                <tr className="bg-gray-50 border-b border-gray-300">
                  <td className="py-2 pl-2">Service</td>
                  <td>{serviceMarks}</td>
                </tr>
              )}

              {designation.includes("hod") && (
                <tr className="bg-gray-200 font-semibold">
                  <td className="py-2 pl-2">Total</td>
                  <td>{totalMarks}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export default ThanksPage;
