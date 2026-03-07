import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import fileIcon from "../../assets/file_icon.svg";
const TeachingForm13 = ({ data }) => {
  const [isDropDown, setIsDropdown] = useState(false);
  const [academicRoles, setAcademicRoles] = useState(0);
  const [visitingType, setVisitingType] = useState("No");
  const [selectedRoles, setSelectedRoles] = useState([]);

  const markdata = localStorage.getItem("appraisal_outofmark");
  // Parse the string into an object
  const parsedMarkData = JSON.parse(markdata);

  // states
  const [designationuser, setDesignationuser] = useState();
  const [name, setName] = useState();
  const [id, setId] = useState();
  const [files, setFiles] = useState([
    data.academicPosition.academicPositionFiles || [],
  ]);

  const isFirstRender = useRef(true);

  // decode token
  const token = localStorage.getItem("appraisal_token");
  const decoded = token ? jwtDecode(token) : {};
  const designation = decoded?.designation;
  const API = import.meta.env.VITE_API // ✅ replace with env if needed

  // ✅ Toggle Role
  const toggleRole = (role) => {
    const updatedRoles = selectedRoles.includes(role)
      ? selectedRoles.filter((r) => r !== role)
      : [...selectedRoles, role];

    setSelectedRoles(updatedRoles);
    setAcademicRoles(updatedRoles.length * 1); // 1 mark per role
  };

  // ✅ API CALL
  const handleacademicRolesTypeChange = async (
    updatedVisitingType,
    updatedRoles
  ) => {
    if (!designation || !token || !name || !id || !designationuser) {
      console.error("Missing required values", {
        designation,
        token,
        name,
        id,
        designationuser,
      });
      return;
    }

    try {
      const response = await axios.post(
        `${API}/api/academicRoles/${designation}`,
        {
          roles: updatedRoles || selectedRoles,
          facultyName: name,
          employeeId: id,
          designation: designationuser,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAcademicRoles(response.data.finalMarks || 0);
      console.log("✅ Academic Roles Saved:", response.data);
    } catch (error) {
      console.error(
        "❌ Error updating academic roles:",
        error.response?.data || error.message
      );
    }
  };

  // ✅ Load Default Values
  useEffect(() => {
    if (data?.academicPosition) {
      let parsedValue = {};
      try {
        parsedValue =
          typeof data.academicPosition.value === "string"
            ? JSON.parse(data.academicPosition.value)
            : data.academicPosition.value || {};
        setFiles(data.academicPosition.academicPositionFiles || []);
      } catch (err) {
        console.error(
          "Invalid academicPosition value JSON:",
          data.academicPosition.value,
          err
        );
      }

      setSelectedRoles(parsedValue.roles || []);
      setVisitingType(parsedValue.status || "No");
      setAcademicRoles(data.academicPosition.marks ?? 0);

      setDesignationuser(data.designation);
      setName(data.facultyName);
      setId(data.employee?._id);
    }
  }, [data]);

  // ✅ Trigger API only when user changes (skip first render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (name && id && designationuser) {
      handleacademicRolesTypeChange(visitingType, selectedRoles);
    }
  }, [visitingType, selectedRoles, name, id, designationuser]);
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
    <div className="main-container border p-5 border-[#AAAAAA] bg-white rounded-xl ">
      <div className="input-container-3 grid gap-4 grid-cols-12">
        {/* Left Section */}
        <div className="first-container pr-3 border-r border-gray-400 col-span-10">
          <div>
            <h1 className="text-lg font-medium">
              Are you an Academic Coordinator / Class Advisor (2 Points)
              <span className="text-red-500">*</span>
            </h1>
            <h1 className="text-gray-500">
              Course Coordinator / Timetable Coordinator / Exam Cell / Lab
              Coordinator / Project Coordinator – Each 1 Point
            </h1>
            <div className="flex gap-4 items-center mt-2">
              <div className="input-container-1 flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={visitingType === "Yes"}
                  onChange={() => setVisitingType("Yes")}
                  className="accent-teal-600 scale-125"
                />
                <label className="text-gray-500 font-medium">Yes</label>
              </div>
              <div className="input-container-1 flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={visitingType === "No"}
                  onChange={() => setVisitingType("No")}
                  className="accent-teal-600 scale-125"
                />
                <label className="text-gray-500 font-medium">No</label>
              </div>
            </div>
          </div>
          {visitingType !== "No" && (
            <>
              {/* Dropdown */}
              <div className="select-container mt-2 relative ">
                <div className="header flex items-center justify-between border border-[#8B9AA9] rounded-lg px-2 py-2">
                  <div className="text-container flex items-center gap-3">
                    {selectedRoles?.map((item, index) => (
                      <div key={index}>
                        <h1>{item}</h1>
                      </div>
                    ))}
                  </div>
                  <ChevronDown
                    onClick={() => setIsDropdown(!isDropDown)}
                    className={`cursor-pointer ${
                      isDropDown ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {isDropDown && (
                  <div className="dropdown-container w-full  space-y-3 absolute top-full p-2 bg-white border border-[#AAAAAA] rounded-lg z-10">
                    {[
                      "Course Coordinator",
                      "Timetable Coordinator",
                      "Exam Cell",
                      "Lab Coordinator",
                      "Project Coordinator",
                    ].map((role) => (
                      <div
                        key={role}
                        className="input-container flex gap-3 items-center"
                      >
                        <input
                          type="checkbox"
                          className="accent-[#3ab5a3]"
                          checked={selectedRoles.includes(role)}
                          onChange={() => toggleRole(role)}
                        />
                        <label className="text-[#8B9AA9]">{role}</label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Files list */}
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
                    className="file-card w-fit p-2 file-icon-container mt-2 rounded-lg flex cursor-pointer gap-2"
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

        {/* Right Section */}
        <div className="second-container col-span-2 text-center">
          <h1 className="text-lg font-medium">Marks</h1>
          <div className="h-[80%] flex items-center justify-center">
            <h1 className="text-[#646464] text-lg">
              <span className="font-semibold text-[#318179]">
                {academicRoles}
              </span>{" "}
              out of {parsedMarkData?.points?.academicRoles || 0}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeachingForm13;
