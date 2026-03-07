import { UploadCloud } from "lucide-react";
import React, { useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Data } from "../../Context/store.js";
import axios from "axios";
import fileIcon from "../../assets/file_icon.svg";

const TeachingForm5 = ({ data }) => {
  const { markData } = useContext(Data);
  const API = "https://appraisaltestingbackend-1.onrender.com";

  const [visitingType, setVisitingType] = useState("None");
  const [guestLecturemark, setGuestLecturemark] = useState(0);
  const [files, setFiles] = useState([
    data?.visitingFaculty.visitingFacultyFiles || [],
  ]);
  const [selectedValue, setSelectedValue] = useState();
  const [selectedValues, setSelectedValues] = useState();
  const [visitingFacultyMark, setvisitingFacultyMark] = useState(0);
  const [designationuser, setDesignationuser] = useState();
  const [name, setName] = useState();
  const [id, setId] = useState();

  // decode token
  const token = localStorage.getItem("appraisal_token");
  const decoded = token ? jwtDecode(token) : {};
  const designation = decoded?.designation;

  // Allowed file types
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  ];

  const markdata = localStorage.getItem("appraisal_outofmark");
  // Parse the string into an object
  const parsedMarkData = JSON.parse(markdata);
  // handle radio selection
  const handleSelection = (option) => {
    setSelectedValue(option.value);
    setFeedbackMark(option.mark);
  };
  const handleVisitingTypeChange = async (selectedValue) => {
    setSelectedValues(selectedValue);
    try {
      setVisitingType(selectedValue); // update state immediately

      const response = await axios.post(
        `${import.meta.env.VITE_API}/api/guestLecture/${designation}`, // ✅ fixed double slash
        {
          GuestLecture: selectedValue,
          facultyName: name,
          employeeId: id,
          designation: designationuser,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // include token if your API is protected
          },
        }
      );

      setGuestLecturemark(response.data.finalMarks);
    } catch (error) {
      console.error(
        "Error submitting teaching type:",
        error.response?.data || error.message
      );
    }
  };
  // set initial value from props
  useEffect(() => {
    if (data?.visitingFaculty) {
      setSelectedValue(data.visitingFaculty.value);
      setvisitingFacultyMark(data.visitingFaculty.marks ?? 0);
      setDesignationuser(data.designation);
      setName(data.facultyName);
      setId(data.employee._id);
      setFiles(data.visitingFaculty.visitingFacultyFiles);
    }
  }, [data]);

  // call API when selectedValue changes (but skip initial mount)
  useEffect(() => {
    if (selectedValue && data?.feedback?.value !== selectedValue) {
      handleVisitingTypeChange(selectedValue);
    }
  }, [selectedValue]);

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
        {/* Left Section */}
        <div className="first-container pr-3 border-r border-gray-400 col-span-10">
          <div>
            <h1 className="text-lg font-medium">
              Organizing Guest Lectures / Inviting Visiting Faculty for
              respective subject <span className="text-red-500">*</span>
            </h1>
            <h1 className="text-lg text-[#646464] font-medium text-[16px] mt-1">
              National Experts - 1 Point || International Experts - 2 Points
            </h1>
          </div>

          {/* Radio buttons */}
          <div className="radio-button-container space-y-2 px-2 py-2 rounded-lg mt-2 text-[#646464] font-medium">
            <div className="input-1 flex items-center gap-2">
              <input
                type="radio"
                name="visitingType"
                value="National Experts"
                className="scale-125 accent-teal-400 cursor-pointer"
                checked={visitingType === "National Experts"}
                onChange={(e) => handleVisitingTypeChange(e.target.value)}
              />
              <label className="text-gray-500">National Experts</label>
            </div>

            <div className="input-1 flex items-center gap-2">
              <input
                type="radio"
                name="visitingType"
                value="International Experts"
                className="scale-125 accent-teal-400 cursor-pointer"
                checked={visitingType === "International Experts"}
                onChange={(e) => handleVisitingTypeChange(e.target.value)}
              />
              <label className="text-gray-500">International Experts</label>
            </div>

            <div className="input-1 flex items-center gap-2">
              <input
                type="radio"
                name="visitingType"
                value="None"
                className="scale-125 accent-teal-400 cursor-pointer"
                checked={visitingType === "None"}
                onChange={(e) => handleVisitingTypeChange(e.target.value)}
              />
              <label className="text-gray-500">None</label>
            </div>
            <div className="file-attachment-container mt-4 "></div>
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

        {/* Right Section */}
        <div className="second-container col-span-2 text-center">
          <h1 className="text-lg font-medium">Marks</h1>
          <div className="h-[80%] flex items-center justify-center">
            <h1 className="text-[#646464] text-lg">
              <span className="font-semibold text-[#318179]">
                {guestLecturemark}
              </span>{" "}
              out of {parsedMarkData?.points?.guest || 0}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeachingForm5;
