import React, { useContext, useEffect } from "react";
import {
  ChevronDown,
  Upload,
  UserStar,
  UploadCloud,
  X,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { Data } from "../../Context/store.js";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import fileIcon from "../../assets/file_icon.svg";

const ServiceForm1 = ({ data, servicePoints }) => {
  console.log("Servipints ", servicePoints);
 const API = import.meta.env.VITE_API
  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const designation = decoded.designation;
  // const username = decoded.facultyName;
  const employeeId = data?.employee._id;
  console.log("employeeId", employeeId);
  const name = data.employee.fullName;
  const userDesignation = data.employee.designation;
  const { serviceMarks } = useContext(Data);
  const [roles, setRoles] = useState(
    data?.activities?.value?.roles?.includes("None")
      ? []
      : data?.activities?.value?.roles || []
  );
  console.log("service roles", roles);

  // states
  const [institutionalCoordinator, setInstitutionalCoordinator] =
    useState(false);
  const [departmentCoordinator, setDepartmentCoordinator] = useState(false);
  const [fileIncharge, setFileIncharge] = useState(false);
  const [none, setNone] = useState(true);
  const [files, setFiles] = useState(data?.activities?.activitiesFiles);
  const [mark, setMark] = useState(data?.activities?.marks);

  console.log("form 3.1 : ", departmentCoordinator);

  // Handle "None" click
  function handleNone() {
    const newNone = !none;
    setNone(newNone);
    if (newNone) {
      setInstitutionalCoordinator(false);
      setDepartmentCoordinator(false);
      setFileIncharge(false);
    }
  }

  // Handle other checkboxes
  function handleOther(setter) {
    setter((prev) => !prev);
    setNone(false);
  }

  // handle role change
  const handleRoleChange = async (checked, roleName) => {
    let updatedRoles;
    if (checked) {
      updatedRoles = [...roles, roleName];
    } else {
      updatedRoles = roles.filter((r) => r !== roleName);
    }

    setRoles(updatedRoles);
    const formData = new FormData();
    formData.append("roles", updatedRoles);
    formData.append("facultyName", name);
    formData.append("employeeId", employeeId);
    formData.append("designation", userDesignation);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/api/activities/${designation}`,

        formData,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response for form 3.1:", response.data.finalMarks);

      setMark(response.data.finalMarks);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNoneChange = async () => {
    setRoles([]);
    setMark(0);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/api/activities/${designation}`,
        {
          roles: "None",
          facultyName: name,
          employeeId: employeeId,
          designation: userDesignation,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response for form 3.1:", response.data.finalMarks);

      setMark(response.data.finalMarks);
    } catch (err) {
      console.error(err);
    }
  };
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
    <>
      <div className="input-container-2 border border-[#AAAAAA] p-4  bg-white  rounded-xl grid gap-4 grid-cols-12">
        <div className="first-container pr-3 border-r border-gray-400 col-span-10">
          {/* .heading / question  */}
          <div>
            <h1 className="text-lg font-medium">
              Accreditation Activities - NAAC, NBA, UGC, NIRF, AU etc.,{" "}
              <span className="text-red-500">*</span>
            </h1>
            <h1 className="text-gray-400 font-medium px-6">
              Institutional Coordinator - 5 Points, Department Coordinator - 3
              Points, <br /> File In-charge - 2 Points
            </h1>
          </div>
          <div className="checkbox-container px-6 mt-4 space-y-2">
            <div className="container-1 flex gap-2 items-center">
              <input
                type="checkbox"
                className="scale-125 cursor-pointer accent-teal-500"
                checked={roles?.includes("InstitutionalCoordinator")}
                onChange={(e) =>
                  handleRoleChange(e.target.checked, "InstitutionalCoordinator")
                }
              />
              <label className="text-gray-400">Institutional Coordinator</label>
            </div>

            <div className="container-1 flex gap-2 items-center">
              <input
                type="checkbox"
                className="scale-125 cursor-pointer accent-teal-500"
                checked={roles?.includes("DepartmentCoordinator")}
                onChange={(e) =>
                  handleRoleChange(e.target.checked, "DepartmentCoordinator")
                }
              />
              <label className="text-gray-400">Department Coordinator</label>
            </div>

            <div className="container-1 flex gap-2 items-center">
              <input
                type="checkbox"
                className="scale-125 cursor-pointer accent-teal-500"
                checked={roles?.includes("FileIncharge")}
                onChange={(e) =>
                  handleRoleChange(e.target.checked, "FileIncharge")
                }
              />
              <label className="text-gray-400">File In-charge</label>
            </div>
            {console.log("selected service : ", roles)}
            <div className="container-1 flex gap-2 items-center">
              <input
                type="checkbox"
                className="scale-125 cursor-pointer accent-teal-500"
                checked={roles.length === 0} // checked if no roles selected
                onChange={(e) => {
                  if (e.target.checked) {
                    // ✅ user selected "None"
                    handleNoneChange();
                  } else {
                    // ✅ user unselected "None"
                    setRoles([]); // or restore.js previous roles if needed
                    setMark(0);
                  }
                }}
              />
              <label className="text-gray-400">None</label>
            </div>
          </div>
          {/* .files container  */}
          <div className="file-container mt-4">
            {files.map((item, index) => {
              const normalizedPath = item.replace(/\\/g, "/");
              const fileName = normalizedPath.split("/").pop();
              return (
                <>
                  <div
                    onClick={() => handleFilePreview(files)}
                    className="file-card file-icon-container w-fit p-2 border border-gray-300 rounded-lg flex cursor-pointer gap-2"
                  >
                    <img src={fileIcon} className="w-6 h-6" alt="file icon" />
                    <h1 className="text-gray-800">{fileName.slice(0, 15)}</h1>
                  </div>
                </>
              );
            })}
          </div>
        </div>
        {/* marks container  */}
        <div className="second-container col-span-2 text-center">
          <h1 className="text-lg font-medium">Marks</h1>
          <div className="h-[80%] flex items-center justify-center">
            <h1 className="text-[#646464]  text-lg">
              <span className="font-semibold text-[#318179]">{mark || 0}</span>{" "}
              out of {servicePoints?.activities}
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceForm1;
