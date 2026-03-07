import { UploadCloud } from "lucide-react";
import React, { useState, useContext, useEffect, useRef } from "react";
import { Data } from "../../Context/store.js";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import fileIcon from "../../assets/file_icon.svg";

const TeachingForm9 = ({ data }) => {
   const API = import.meta.env.VITE_API
  const [facultyDevelopmentAttendedFile, setFacultyDevelopmentAttendedFile] =
    useState([]);
  const [fdp1, setFdp1] = useState(false);
  const [fdp2, setFdp2] = useState(false);
  const [online1, setOnline1] = useState(false);
  const [online2, setOnline2] = useState(false);
  const [programsmark, setProgramsmark] = useState(0);
  const isFirstRender = useRef(true);
  const [files, setFiles] = useState([data.fdp.fdpFiles || []]);

  const { markData } = useContext(Data);

  const [fdpMark, setfdpMark] = useState(0);
  const [designationuser, setDesignationuser] = useState();
  const [name, setName] = useState();
  const [id, setId] = useState();

  const token = localStorage.getItem("appraisal_token");
  const decoded = token ? jwtDecode(token) : {};
  const designation = decoded?.designation;
  const markdata = localStorage.getItem("appraisal_outofmark");
  // Parse the string into an object
  const parsedMarkData = JSON.parse(markdata);

  // ---------- API CALL ----------
  async function handleApiCall() {
    if (!name || !id || !designationuser) return;

    const semesterData = {
      Sem1: { fdp: fdp1, online: online1 },
      Sem2: { fdp: fdp2, online: online2 },
    };

    const formData = new FormData();
    formData.append("semesterData", JSON.stringify(semesterData));
    formData.append("facultyName", name);
    formData.append("employeeId", id);
    formData.append("designation", designationuser);

    facultyDevelopmentAttendedFile.forEach((file) => {
      formData.append("FdpprogramFiles", file);
    });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/api/fdpPrograms/${designation}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProgramsmark(response.data.finalMarks || 0);
      console.log("✅ FDP Saved:", response.data);
    } catch (err) {
      console.error("❌ FDP Save Error:", err.response?.data || err.message);
    }
  }

  // ---------- Load Default Values from GET API ----------
  useEffect(() => {
    if (data?.fdp) {
      let parsedValue = {};
      try {
        parsedValue = JSON.parse(data.fdp.value || "{}"); // 👈 parse JSON
      } catch (err) {
        console.error("Invalid FDP value JSON:", data.fdp.value, err);
      }

      // ✅ set defaults from backend
      setFdp1(parsedValue.Sem1?.fdp || false);
      setOnline1(parsedValue.Sem1?.online || false);
      setFdp2(parsedValue.Sem2?.fdp || false);
      setOnline2(parsedValue.Sem2?.online || false);

      setfdpMark(data.fdp.marks ?? 0);
      setDesignationuser(data.designation);
      setName(data.facultyName);
      setId(data.employee?._id);

      setFiles(data.fdp.fdpFiles); // 👈 set default files if any
    }
  }, [data]);

  // ---------- Trigger Save ONLY when user changes ----------
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false; // 👈 skip first run
      return;
    }
    if (name && id && designationuser) {
      handleApiCall();
    }
  }, [fdp1, online1, fdp2, online2, facultyDevelopmentAttendedFile]);
  // async function handleFilePreview(fileName) {
  //   try {
  //     const response = await axios.get(
  //       `${import.meta.env.VITE_API}/api/file/${fileName}`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //         responseType: "blob", // 👈 file comes as binary blob
  //       }
  //     );

  //     // create a blob URL
  //     const fileURL = URL.createObjectURL(response.data);

  //     // open in new tab
  //     window.open(fileURL, "_blank");
  //   } catch (err) {
  //     console.error("error:", err.message);
  //   }
  // }
  const handleFilePreview = (files) => {
    window.open(files[0], "_blank");
  };
  return (
    <div className="main-container border p-5 border-[#AAAAAA] bg-white rounded-xl">
      <div className="input-container-3 grid gap-4 grid-cols-12">
        <div className="first-container pr-3 border-r border-gray-400 col-span-10">
          <h1 className="text-lg font-medium">
            Faculty Development Programme attended.
          </h1>

          {/* Semester 1 */}
          <div className="mt-4">
            <label className="text-gray-900 text-lg font-medium block mb-2">
              Semester 1
            </label>
            <p className="text-gray-800">Have you attended FDP programs?</p>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={fdp1}
                  onChange={() => setFdp1(!fdp1)}
                  className="scale-125 accent-teal-400 cursor-pointer"
                />
                FDP Attended
              </label>
            </div>

            <p className="text-gray-800 mt-2">Have you passed Online course?</p>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={online1}
                  onChange={() => setOnline1(!online1)}
                  className="scale-125 accent-teal-400 cursor-pointer"
                />
                Online Course
              </label>
            </div>
          </div>

          {/* Semester 2 */}
          <div className="mt-6 border-t pt-4">
            <label className="text-gray-900 text-lg font-medium block mb-2">
              Semester 2
            </label>
            <p className="text-gray-800">Have you attended FDP programs?</p>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={fdp2}
                  onChange={() => setFdp2(!fdp2)}
                  className="scale-125 accent-teal-400 cursor-pointer"
                />
                FDP Attended
              </label>
            </div>

            <p className="text-gray-800 mt-2">Have you passed Online course?</p>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={online2}
                  onChange={() => setOnline2(!online2)}
                  className="scale-125 accent-teal-400 cursor-pointer"
                />
                Online Course
              </label>
            </div>
          </div>
          {files?.map((fileItem, idx) => {
            // if it's a string path
            let normalizedPath = "";
            if (typeof fileItem === "string") {
              normalizedPath = fileItem.replace(/\\/g, "/");
            }
            // if it's an object with path
            else if (fileItem?.path) {
              normalizedPath = fileItem.path.replace(/\\/g, "/");
            }
            // if it's a File object (from input)
            else if (fileItem?.name) {
              normalizedPath = `uploads/${fileItem.name}`;
            } else {
              console.warn("Unexpected file format:", fileItem);
              return null; // skip invalid item
            }

            const fileUrl = `${API}/${normalizedPath}`;
            const fileName = normalizedPath.split("/").pop();

            return (
              <div
                key={idx}
                onClick={() => handleFilePreview(files)}
                className="file-card w-fit p-2 file-icon-container rounded-lg flex cursor-pointer gap-2"
              >
                <div className="img-container file-icon-container p-2 rounded">
                  <img src={fileIcon} className="w-6 h-6" alt="file icon" />
                </div>
                <div className="content-container">
                  <h1 className="truncate max-w-xs">{fileName.slice(0, 15)}</h1>
                </div>
              </div>
            );
          })}
        </div>

        {/* Marks Section */}
        <div className="second-container col-span-2 text-center">
          <h1 className="text-lg font-medium">Marks</h1>
          <div className="h-[80%] flex items-center justify-center">
            <h1 className="text-[#646464] text-lg">
              <span className="font-semibold text-[#318179]">
                {programsmark || 0}
              </span>{" "}
              out of {parsedMarkData?.points?.fdpProgramme || 0}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeachingForm9;
