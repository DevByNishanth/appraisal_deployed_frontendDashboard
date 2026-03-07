import { Plus, Trash2, X } from "lucide-react";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

import TeachingForm3 from "../TeachingForm/TeachingForm3";
import TeachingForm4 from "./TeachingForm4";
import TeachingForm5 from "./TeachingForm5";
import TeachingForm6 from "./TeachingForm6";
import TeachingForm7 from "./TeachingForm7";
import TeachingForm8 from "./TeachingForm8";
import TeachingForm9 from "./TeachingForm9";
import TeachingForm10 from "./TeachingForm10";
import TeachingForm12 from "./TeachingForm12";
import TeachingForm13 from "./TeachingForm13";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import TeachingPreview from "../TeachingPreview";
import { Data } from "../../Context/store.js";
import fileIcon from "../../assets/file_icon.svg";

const TeachingForm = () => {
  const { form_id } = useParams();
  const { canditateData, setCandidateData } = useContext(Data);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API

  const [inputGroups, setInputGroups] = useState([]);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teachingmark, setTeachingmark] = useState();
  const [PassPercentage, setPassPercentage] = useState();
  const [showTeqachingPreview, setShowTeachingPreview] = useState(false);
  const [passPercentagemark, setPassPercentagemark] = useState();

  const [selectedValue, setSelectedValue] = useState("");
  console.log("pass percentage value : ", selectedValue);
  const [teachMark, setTeachMark] = useState(0);
  const [subjectslist, setSubjectslist] = useState(0);
  const [files, setFiles] = useState(data?.scopusBookFiles || []);
  const [designationuser, setDesignationuser] = useState(
    data?.designation || ""
  );

  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [teachPerMark, setTeachPerMark] = useState(0);

  const token = localStorage.getItem("appraisal_token");
  const decoded = token ? jwtDecode(token) : {};
  const designations = decoded?.designation; // make sure you store.js token in localStorage

  // ------------------- Fetch Data on Load -------------------
  useEffect(() => {
    if (!form_id) return;

    const fetchJoinAnswer = async () => {
      try {
        console.log("Calling API with:", form_id);

        const res = await axios.get(`${import.meta.env.VITE_API}/api/joinAnswer/${form_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("API response:", res.data);
        setData(res.data);
        setCandidateData(res.data);

        // ✅ Teaching Assignment. (default or empty)
        if (res.data?.teachingAssignment?.subjects?.length > 0) {
          const prefilled = res.data.teachingAssignment.subjects.map((sub) => ({
            id: sub.id || Date.now() + Math.random(),
            subjectCode: sub.subjectCode || "",
            subjectName: sub.subjectName || "",
            credits: sub.credits || "",
          }));
          setInputGroups(prefilled);
        } else {
          setInputGroups([
            { id: Date.now(), subjectCode: "", subjectName: "", credits: "" },
          ]);
        }

        const { value = "None", marks = 0 } = res.data?.passPercentage || {};
        setSelectedValue(value);

        // ✅ Other details

        setDesignationuser(res.data.designation);
        setName(res.data.facultyName || "");
        setId(res.data.employee?._id || "");
        setTeachMark(res?.data?.teachingAssignment?.marks || "");
        setPassPercentagemark(res?.data?.passPercentage?.marks || 0);
        setFiles(res?.data?.teachingAssignment.teachingFiles);
      } catch (err) {
        console.error("API error:", err);
        setError(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJoinAnswer();
  }, [form_id, token, API]);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!designationuser || !token) return;

      try {
        // 🔹 1. Fetch points
        const pointsResponse = await axios.get(
          `${import.meta.env.VITE_API}/api/points/${designationuser}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // setOutOfMarks(pointsResponse.data);

        const teachingData = pointsResponse.data.find(
          (item) => item.category === "teaching"
        );

        if (teachingData) {
          const teachingAssignment =
            teachingData?.points?.teachingAssignment || 0;
          const passPercentage = teachingData?.points?.passPercentage || 0;
          const studentFeedback = teachingData?.points?.studentFeedback || 0;

          setTeachingmark(teachingAssignment);
          setPassPercentage(passPercentage);

          localStorage.setItem(
            "appraisal_outofmark",
            JSON.stringify(teachingData)
          );

          // setMarkData(teachingData);
        }

        // 🔹 2. Fetch subjects
        const subjectsResponse = await axios.get(`${API}/api/Subjects`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSubjectslist(subjectsResponse.data);

        console.log("✅ Data fetched:", {
          points: pointsResponse.data,
          subjects: subjectsResponse.data,
        });
      } catch (error) {
        console.error(
          "❌ Error in fetching data:",
          error.response?.data || error.message
        );
      }
    };

    fetchAllData();
  }, [designationuser, token, API]);

  // ------------------- Teaching Assignment -------------------
  const handleAddGroup = () => {
    setInputGroups([
      ...inputGroups,
      { id: Date.now(), subjectCode: "", subjectName: "", credits: "" },
    ]);
  };
// Helper function to update backend
const updateTeachingAssignment = async (groups) => {
  try {
    const subjectsJson = groups.map((sub) => ({
      id: sub.id || Date.now(),
      subjectCode: sub.subjectCode || "",
      subjectName: sub.subjectName || "",
      credits: sub.credits || "",
    }));

    const formData = {
      facultyName: name,
      employeeId: id,
      designation: designationuser,
      teachingAssignment: subjectsJson,
    };

    const response = await axios.post(
      `${API}/api/teaching/${designations}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    setTeachMark(response.data.finalMarks);
    console.log("Final Marks:--->", response.data.finalMarks);
  } catch (err) {
    console.error("TeachingAssignment update failed:", err.response?.data || err);
  }
};

// Input change handler
const handleInputChange = (index, field, value) => {
  const updatedGroups = [...inputGroups];
  updatedGroups[index][field] = value;
  setInputGroups(updatedGroups);

  // Only call API if all required fields are filled
  const currentGroup = updatedGroups[index];
  if (
    currentGroup.subjectCode.trim() &&
    currentGroup.subjectName.trim() &&
    currentGroup.credits.trim()
  ) {
    updateTeachingAssignment(updatedGroups);
  }
};

// Remove group handler
const handleRemoveGroup = (id) => {
  const updatedGroups = inputGroups.filter((group) => group.id !== id);
  setInputGroups(updatedGroups);

  // Call API to sync backend
  updateTeachingAssignment(updatedGroups);
};


  // ------------------- Pass Percentage -------------------
  const handleChangeTeachingPercentage = async (value) => {
    setSelectedValue(value);

    // Example: set marks depending on selection
    let marks = 0;
    if (value === "100%") marks = 3;
    else if (value === "90 to 99%") marks = 2;
    else if (value === "80 to 89%") marks = 1;
    else marks = 0;

    setTeachPerMark(marks);
    try {
      const response = await axios.post(
        `${API}/api/passPercentage/${designations}`,
        {
          passPercentage: value,
          facultyName: name,
          employeeId: id,
          designation: designationuser,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPassPercentagemark(response.data.finalMarks);
      console.log("Final Marks (Pass Percentage):", response.data.finalMarks);
    } catch (error) {
      console.error("Error submitting teaching percentage:", error);
    }
  };

  // ------------------- Next Button -------------------
  function handleNextButton() {
    setShowTeachingPreview(true);
    // navigate(`/appraisal_form/form/${form_id}/research_form`);
  }

  if (loading)
    return (
      <div className="p-4 h-[100vh] w-[100%] flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;
  //  async function handleFilePreview(fileName) {
  //   try {
  //     const response = await axios.get(
  //       `${import.meta.env.VITE_API}/api/file/${fileName}`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //         responseType: "blob",
  //       }
  //     );
  //     const fileURL = URL.createObjectURL(response.data);
  //     window.open(fileURL, "_blank");
  //   } catch (err) {
  //     console.error("error:", err.message);
  //   }
  // }
  const handleFilePreview = (files) => {
    window.open(files[0], "_blank");
  };

  return (
    <>
      <div className="main-container space-y-2 p-4 h-[75vh] overflow-auto">
        {/* ================= Teaching Assignment ================= */}
        <div className="input-container-1 border border-[#AAAAAA] p-5 bg-white rounded-xl grid gap-4 grid-cols-12">
          <div className="first-container pr-8 border-r border-gray-400 col-span-10">
            <div className="flex items-center justify-between ">
              <div>
                <h1 className="text-lg font-medium">
                  Teaching Assignment <span className="text-red-500">*</span>
                  <span className="text-sm text-gray-400">
                    ( No of credits per subject taught )
                  </span>
                </h1>
                <h1 className="text-lg text-[#646464] font-medium text-[16px] mt-1">
                  ( 3 Credits -1 Point || Max 3 Points )
                </h1>
              </div>
              <button
                className="bg-[#3ab5a3] cursor-pointer w-7 h-7 flex items-center justify-center rounded-full text-white"
                onClick={handleAddGroup}
              >
                <Plus />
              </button>
            </div>

            {inputGroups.map((group, index) => (
              <div
                key={group.id || index}
                className="relative mt-4 w-[100%] flex gap-3 items-center"
              >
                <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={group.subjectCode}
                    onChange={(e) =>
                      handleInputChange(index, "subjectCode", e.target.value)
                    }
                    placeholder="Enter Subject Code"
                    className="border border-[#AAAAAA] rounded-md px-2 py-2 w-full"
                  />

                  <input
                    type="text"
                    value={group.subjectName}
                    onChange={(e) =>
                      handleInputChange(index, "subjectName", e.target.value)
                    }
                    placeholder="Enter Subject"
                    className="border border-[#AAAAAA] rounded-md px-2 py-2 w-full"
                  />

                  <select
                    value={group.credits}
                    onChange={(e) =>
                      handleInputChange(index, "credits", e.target.value)
                    }
                    className="border border-[#AAAAAA] rounded-md px-2 py-2 w-full"
                  >
                    <option value="">Select Credits</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>
                {index !== 0 && (
                  <div className="icon-container bg-red-400 rounded-full flex items-center justify-center w-9 h-9  right-[-32px] top-2">
                    <Trash2
                      className=" text-white  cursor-pointer"
                      onClick={() => handleRemoveGroup(group.id, index)}
                    />
                  </div>
                )}
              </div>
            ))}
            {files.map((filePath, idx) => {
              // normalize Windows path (backslashes → forward slashes)
              const normalizedPath = filePath.replace(/\\/g, "/");

              // build file URL
              const fileUrl = `${API}/${normalizedPath}`;

              // extract filename
              const fileName = normalizedPath.split("/").pop();

              return (
                <div
                  onClick={() => handleFilePreview(files)}
                  className="file-card w-fit p-2 border-gray-400 mt-2 file-icon-container  rounded-lg flex cursor-pointer gap-2"
                >
                  <div className="img-container file-icon-container p-2 rounded">
                    <img src={fileIcon} className="w-6 h-6" alt="file icon" />
                  </div>
                  <div className="content-container">
                    <h1 className="truncate max-w-xs">
                      {fileName.slice(0, 15)}
                    </h1>
                    {/* Optional: if your API also returns file size, show it here */}
                  </div>
                </div>
              );
            })}

            {/* <button
              onClick={handleAddGroup}
              className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-md"
            >
              + Add Subject
            </button> */}
          </div>

          {/* Marks column */}
          <div className="second-container col-span-2 text-center">
            <h1 className="text-lg font-medium">Marks</h1>
            <div className="h-[80%] flex items-center justify-center">
              <h1 className="text-[#646464] text-lg">
                <span className="font-semibold text-[#318179]">
                  {teachMark || 0}
                </span>{" "}
                out of{teachingmark || 0}
              </h1>
            </div>
          </div>
        </div>

        {/* ================= Pass Percentage ================= */}
        <div className="input-container-2 border border-[#AAAAAA] p-4 bg-white rounded-xl grid gap-4 grid-cols-12">
          <div className="first-container pr-3 border-r border-gray-400 col-span-10">
            <h1 className="text-lg font-medium">
              Pass Percentage <span className="text-red-500">*</span>
              <span className="text-sm text-gray-400"> ( Average )</span>
            </h1>
            <h1 className="text-lg text-[#646464] font-medium text-[16px] mt-1">
              ( 100% - 3 Points || 90 to 99% - 2 Points || 80 to 89% - 1 Point )
            </h1>
            {console.log("val : ", selectedValue)}
            <div className="space-y-2 px-2 py-2 mt-2">
              {["100%", "90 to 99%", "80 to 89%", "None"].map((option) => (
                <div key={option} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="teaching-percentage"
                    value={option}
                    checked={selectedValue === option ? true : false}
                    onChange={(e) =>
                      handleChangeTeachingPercentage(e.target.value)
                    }
                    className="scale-125 accent-teal-400 cursor-pointer"
                  />
                  <label className="text-gray-500">{option}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="second-container col-span-2 text-center">
            <h1 className="text-lg font-medium">Marks</h1>
            <div className="h-[80%] flex items-center justify-center">
              <h1 className="text-[#646464] text-lg">
                <span className="font-semibold text-[#318179]">
                  {passPercentagemark || 0}
                </span>{" "}
                out of {PassPercentage || 0}
              </h1>
            </div>
          </div>
        </div>

        {/* Other Teaching Forms */}
        <TeachingForm3 data={data} />
        <TeachingForm4 data={data} />
        <TeachingForm5 data={data} />
        <TeachingForm7 data={data} />
        <TeachingForm6 data={data} />
        <TeachingForm8 data={data} />
        <TeachingForm9 data={data} />
        <TeachingForm10 data={data} />
       {designationuser !== "Professor" && (
          <>
            <TeachingForm12 data={data} />
            <TeachingForm13 data={data} />
          </>
        )}
      </div>

      {/* Next Button */}
      <div className="button-container flex items-center pr-7 justify-end mt-2">
        <button
          onClick={handleNextButton}
          className="bg-[#318179] px-8 py-2 font-medium text-white rounded cursor-pointer hover:bg-[#305551]"
        >
          Next
        </button>
      </div>
      {showTeqachingPreview && (
        <TeachingPreview
          setShowTeachingPreview={setShowTeachingPreview}
          data={data}
        />
      )}
    </>
  );
};

export default TeachingForm;
