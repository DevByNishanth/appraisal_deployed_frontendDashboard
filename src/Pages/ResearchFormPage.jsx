import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import ResearchForm1 from "../Components/ResearchForm/ResearchForm1";
import ResearchForm2 from "../Components/ResearchForm/ResearchForm2";
import ResearchForm3 from "../Components/ResearchForm/ResearchForm3";
import ResearchForm4 from "../Components/ResearchForm/ResearchForm4";
import ResearchForm5 from "../Components/ResearchForm/ResearchForm5";
import ResearchForm6 from "../Components/ResearchForm/ResearchForm6";
import ResearchForm7 from "../Components/ResearchForm/ResearchForm7";
import ResearchForm8 from "../Components/ResearchForm/ResearchForm8";
import ResearchForm9 from "../Components/ResearchForm/ResearchForm9";
import ResearchForm10 from "../Components/ResearchForm/ResearchForm10";
import ResearchForm11 from "../Components/ResearchForm/ResearchForm11";
import ResearchForm13 from "../Components/ResearchForm/ResearchForm13";
import ResearchForm14 from "../Components/ResearchForm/ResearchForm14";
import Sidebar from "../Components/Sidebar";
import AppraisalFormComponentHeader from "../Components/AppraisalFormComponentHeader";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Data } from "../Context/store.js";
import { ChevronRight } from "lucide-react";
import ResearchPreview from "../Components/ResearchPreview";

const ResearchFormPage = () => {
  const [showPreview, setShowPreview] = useState(false);
  // Auth
  const API = import.meta.env.VITE_API
  const token = localStorage.getItem("appraisal_token");
  // Context Data's
  const { canditateData, researchPoints } = useContext(Data);
  console.log("candidate data : ", researchPoints);
  // url parameters
  const { form_id } = useParams();
  // states
  const [dataResearch, setDataResearch] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        setDataResearch(res.data);
      } catch (err) {
        console.error("API error:", err);
        setError(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJoinAnswer();
  }, [form_id, token]);

  if (loading)
    return (
      <div className="mt-2 flex items-center justify-center h-[100vh] w-[100%]">
        <div className="loader"></div>
      </div>
    );
  // if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
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
            <h1 className="font-semibold ">Research</h1>
            <span>
              <ChevronRight className="w-4 h-4 mt-1" />
            </span>
            <h1 className="font-semibold text-[#318179]">
              {canditateData?.facultyName}
            </h1>
          </div>
        </div>
        <div className="container-1 main-container space-y-2 p-4 h-[75vh] overflow-auto">
          <ResearchForm1 data={dataResearch} />
          <ResearchForm2 data={dataResearch} researchPoints={researchPoints} />
          <ResearchForm3 data={dataResearch} researchPoints={researchPoints} />
          <ResearchForm4 data={dataResearch} researchPoints={researchPoints} />
          <ResearchForm5 data={dataResearch} researchPoints={researchPoints} />
          {/* <ResearchForm6 data={dataResearch} /> */}
          <ResearchForm7 data={dataResearch} researchPoints={researchPoints} />
          <ResearchForm8 data={dataResearch} researchPoints={researchPoints} />
          <ResearchForm9 data={dataResearch} researchPoints={researchPoints} />
          <ResearchForm10 data={dataResearch} researchPoints={researchPoints} />
          <ResearchForm11 data={dataResearch} researchPoints={researchPoints} />
          <ResearchForm13 data={dataResearch} researchPoints={researchPoints} />
          <ResearchForm14 data={dataResearch} researchPoints={researchPoints} />
        </div>
        <div className="btn-container mt-4 flex items-center justify-end mx-10">
          <button
            onClick={() => {
              setShowPreview(true);
            }}
            className="bg-teal-700 px-8 py-2 cursor-pointer rounded-md text-white"
          >
            Next
          </button>
        </div>
        {showPreview && (
          <ResearchPreview
            form_id={form_id}
            setShowPreview={setShowPreview}
            dataResearch={dataResearch}
          />
        )}
      </div>
    </div>
  );
};

export default ResearchFormPage;
