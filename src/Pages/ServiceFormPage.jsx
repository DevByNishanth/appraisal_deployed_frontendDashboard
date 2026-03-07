import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import AppraisalFormComponentHeader from "../Components/AppraisalFormComponentHeader";
import ServiceForm1 from "../Components/ServiceForm/ServiceForm1";
import ServiceForm2 from "../Components/ServiceForm/ServiceForm2";
import ServiceForm3 from "../Components/ServiceForm/ServiceForm3";
import ServiceForm4 from "../Components/ServiceForm/ServiceForm4";
import ServiceForm5 from "../Components/ServiceForm/ServiceForm5";
import ServiceForm6 from "../Components/ServiceForm/ServiceForm6";
import { ChevronRight } from "lucide-react";
import { Data } from "../Context/store.js";
import axios from "axios";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ServicePreview from "../Components/ServicePreview";

const ServiceFormPage = () => {
  const [showPreview, setShowPreview] = useState(false);
  const API = import.meta.env.VITE_API
  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const designation = decoded.designation;

  const { form_id } = useParams();
  console.log("form_id------>",form_id)

  const { setServicePoints, servicePoints } = useContext(Data);
  console.log("setServicePoints", servicePoints);

  const [data, setData] = useState(null);
  const [candidate_name, setCandidate_name] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [designationuser, setDesignationuser] = useState("");

  console.log("designationuser0000", designationuser);

  // ✅ fetch points
  const fetchAllData = async (designationValue) => {
    try {
      const pointsResponse = await axios.get(
        `${import.meta.env.VITE_API}/api/points/${designationValue}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Full API Response:", pointsResponse.data[2].points);
      setServicePoints(pointsResponse.data[2].points);

      const researchData = pointsResponse.data.find(
        (item) => item.category === "research"
      );
    } catch (error) {
      console.error(
        "Error fetching points:",
        error.response?.data || error.message
      );
    }
  };

  // ✅ fetch joinAnswer (sets designationuser)
  useEffect(() => {
    if (!form_id) return;

    const fetchJoinAnswer = async () => {
      try {
        console.log("Calling API with:", form_id);
        const res = await axios.get(
          `${import.meta.env.VITE_API}/api/joinAnswer/${form_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("API response:", res.data);

        setData(res.data);
        setCandidate_name(res.data?.facultyName || "");
        setDesignationuser(res.data?.employee?.designation || "");
      } catch (err) {
        console.error("API error:", err);
        setError(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJoinAnswer();
  }, [form_id, token]);

  // ✅ only call fetchAllData AFTER designationuser is set
  useEffect(() => {
    if (designationuser) {
      fetchAllData(designationuser);
    }
  }, [designationuser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading appraisal form...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">No data found for this form.</p>
      </div>
    );
  }

  return (
    <>
      <div className="main-container grid grid-cols-12">
        <div className="sidebar-container col-span-2">
          <Sidebar />
        </div>

        <div className="main-content-container col-span-10">
          <AppraisalFormComponentHeader />

          <div className="form-headerx px-4 pt-2">
            <div className="flex items-center gap-2">
              <h1 className="font-semibold">Appraisal Form</h1>
              <span>
                <ChevronRight className="w-4 h-4 mt-1" />
              </span>
              <h1 className="font-semibold">Service</h1>
              <span>
                <ChevronRight className="w-4 h-4 mt-1" />
              </span>
              <h1 className="font-semibold text-[#318179]">{candidate_name}</h1>
            </div>
          </div>

          <div className="container-1 main-container space-y-2 p-4 h-[75vh] overflow-auto">
            <ServiceForm1 data={data} servicePoints={servicePoints} />
            <ServiceForm2 data={data} servicePoints={servicePoints} />
            <ServiceForm3 data={data} servicePoints={servicePoints} />
            <ServiceForm4 data={data} servicePoints={servicePoints} />
            <ServiceForm5 data={data} servicePoints={servicePoints} />
            <ServiceForm6 data={data} servicePoints={servicePoints} />
          </div>

          <div className="btn-container mt-4 flex items-center justify-end mx-10">
            <button
              onClick={() => setShowPreview(true)}
              className="bg-teal-700 px-8 py-2 cursor-pointer rounded-md text-white"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
      {showPreview && (
        <ServicePreview
          setShowPreview={setShowPreview}
          data={data}
          form_id={form_id}
        />
      )}
    </>
  );
};

export default ServiceFormPage;
