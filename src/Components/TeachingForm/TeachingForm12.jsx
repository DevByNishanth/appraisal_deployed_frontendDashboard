import { UploadCloud } from "lucide-react";
import React, { useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Data } from "../../Context/store.js";
import fileIcon from "../../assets/file_icon.svg";

const API =import.meta.env.VITE_API // Replace with your API

const TeachingForm12 = ({ data }) => {
  const [isChecked, setIsChecked] = useState("");
  const [isChecked2, setIsChecked2] = useState("");
  const [tutorwardMeetingmark, setTutorwardMeetingmark] = useState(0);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [designationuser, setDesignationuser] = useState("");
  const [userDesignation, setUserDesignation] = useState("");
  const [hasChanged, setHasChanged] = useState(false);
  const markdata = localStorage.getItem("appraisal_outofmark");
  // Parse the string into an object
  const parsedMarkData = JSON.parse(markdata);

  const { markData } = useContext(Data);

  const token = localStorage.getItem("appraisal_token");
  const decoded = token ? jwtDecode(token) : {};
  const decodedDesignation = decoded?.designation;
  const [files, setFiles] = useState([
    data.tutorMeeting.tutorMeetingFiles || [],
  ]);

  // Update marks locally
  const updateMarks = (val1, val2) => {
    let marks = 0;
    if (val1 === "Yes") marks += 3;
    if (val2 === "Yes") marks += 2;
    setTutorwardMeetingmark(marks);
  };

  // API call
  const submitTutorWardMeeting = async (tutorWardValue, valueAdditionValue) => {
    if (!token || !name || !decodedDesignation) return;

    try {
      const response = await axios.post(
        `${API}/api/tutorwardMeeting/${decodedDesignation}`,
        {
          tutorWardMeetings: tutorWardValue,
          valueAdditionInStudentLife: valueAdditionValue,
          facultyName: name,
          employeeId: id,
          designation: designationuser,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTutorwardMeetingmark(response.data.finalMarks || 0);
      console.log("Tutor-Ward Meeting submitted ✅", response.data);
    } catch (error) {
      console.error(
        "Error submitting tutor-ward meeting ❌",
        error.response?.data || error.message
      );
    }
  };

  // Set initial values from API data
  useEffect(() => {
    if (data?.tutorMeeting) {
      const tutorWard = data.tutorMeeting?.value?.tutorWardMeetings || "No";
      const valueAdd =
        data?.tutorMeeting?.value?.valueAdditionInStudentLife || "No";

      setIsChecked(tutorWard);
      setIsChecked2(valueAdd);
      updateMarks(tutorWard, valueAdd);

      setName(data.facultyName || "");
      setId(data.employee?._id || "");
      setDesignationuser(data.designation || "");
      setUserDesignation(data.designation || decodedDesignation || "");
      setFiles(data.tutorMeeting.tutorMeetingFiles || []);
    }
  }, [data, decodedDesignation]);

  // Handle radio button changes
  const handleTutorWardMeetingChange = (value) => {
    setIsChecked(value);
    updateMarks(value, isChecked2);
    setHasChanged(true);
  };

  const handleValueAdditionChange = (value) => {
    setIsChecked2(value);
    updateMarks(isChecked, value);
    setHasChanged(true);
  };

  // Call API only when user changes values
  useEffect(() => {
    if (hasChanged && name && userDesignation) {
      submitTutorWardMeeting(isChecked, isChecked2);
      setHasChanged(false); // Reset flag
    }
  }, [isChecked, isChecked2, name, userDesignation, hasChanged]);
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
        {/* Left side */}
        <div className="first-container pr-3 border-r border-gray-400 col-span-10">
          <h1 className="text-lg font-medium">
            Tutor ward meeting. <span className="text-red-500">*</span>
          </h1>

          {/* Tutor Ward Meeting */}
          <div className="radio-button-container space-y-2 px-2 py-2 text-[#646464] font-medium">
            <h1>Minimum 6 meetings with all mentees collectively – 3 Points</h1>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={isChecked === "Yes"}
                  className="accent-teal-600 scale-125"
                  onChange={() => handleTutorWardMeetingChange("Yes")}
                />
                Yes
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={isChecked === "No"}
                  className="accent-teal-600 scale-125"
                  onChange={() => handleTutorWardMeetingChange("No")}
                />
                No
              </label>
            </div>
          </div>

          {/* Value Addition */}
          <div className="radio-button-container space-y-2 px-2 py-2 border-t text-[#646464] font-medium">
            <h1>Value addition brought about in students life – 2 Points</h1>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={isChecked2 === "Yes"}
                  className="accent-teal-600 scale-125"
                  onChange={() => handleValueAdditionChange("Yes")}
                />
                Yes
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={isChecked2 === "No"}
                  className="accent-teal-600 scale-125"
                  onChange={() => handleValueAdditionChange("No")}
                />
                No
              </label>
            </div>
          </div>
          {(isChecked?.toLowerCase() === "yes" ||
            isChecked2?.toLowerCase() === "yes") && (
            <>
              {files?.map((fileItem, idx) => {
                let normalizedPath = "";
                if (typeof fileItem === "string") {
                  normalizedPath = fileItem.replace(/\\/g, "/");
                } else if (fileItem?.path) {
                  normalizedPath = fileItem.path.replace(/\\/g, "/");
                } else if (fileItem?.name) {
                  normalizedPath = `uploads/${fileItem.name}`;
                } else {
                  console.warn("Unexpected file format:", fileItem);
                  return null;
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
                      <h1 className="truncate max-w-xs">
                        {fileName.slice(0, 15)}
                      </h1>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Right side (Marks) */}
        <div className="second-container col-span-2 text-center">
          <h1 className="text-lg font-medium">Marks</h1>
          <div className="h-[80%] flex items-center justify-center">
            <h1 className="text-[#646464] text-lg">
              <span className="font-semibold text-[#318179]">
                {tutorwardMeetingmark}
              </span>{" "}
              out of {parsedMarkData?.points?.tutorMeeting || 0}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeachingForm12;
