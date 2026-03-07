import { UploadCloud } from "lucide-react";

import { useEffect, useState, useContext } from "react";
import { jwtDecode } from "jwt-decode"; // ✅ works with v4+
import axios from "axios";
import { useParams } from "react-router-dom";
import { Data } from "../../Context/store.js";
import fileIcon from "../../assets/file_icon.svg";
const TeachingForm8 = ({ data }) => {
 const API = import.meta.env.VITE_API
  console.log("iiiiiiii", data);
  const { markData } = useContext(Data);

  // Local states

  const [competitionMark, setCompetitionMark] = useState(0);
  const [files, setFiles] = useState([
    data?.innovationProject.innovationProjectFiles || [],
  ]);

  // Define marks for each type
  const competitionOptions = [
    { label: "Participated", value: "Participation", mark: 1 },
    {
      label: "Participated more than 1",
      value: "Participation Greater than 1",
      mark: 2,
    },
    {
      label: "Participated and received prize",
      value: "Participation & Prize",
      mark: 3,
    },
    {
      label: "Participated more than 1 and received prize",
      value: "Participation Greater than 1 & Prize",
      mark: 4,
    },
    { label: "None", value: "None", mark: 0 },
  ];
  // states
  const [selectedValue, setSelectedValue] = useState();
  const [selectedValues, setSelectedValues] = useState();
  const [innovationProjectMark, setinnovationProjectMark] = useState(0);
  const [designationuser, setDesignationuser] = useState();
  const [Competitionmark, setCompetitionmark] = useState();
  const [competition, setCompetition] = useState();
  const [name, setName] = useState();
  const [id, setId] = useState();

  const markdata = localStorage.getItem("appraisal_outofmark");
  // Parse the string into an object
  const parsedMarkData = JSON.parse(markdata);

  // decode token
  const token = localStorage.getItem("appraisal_token");
  const decoded = token ? jwtDecode(token) : {};
  const designation = decoded?.designation;

  const handleCompetitionTypeChange = async (value) => {
    setSelectedValues(value);
    setSelectedValue(value);
    try {
      // Update UI state

      const response = await axios.post(
        `${import.meta.env.VITE_API}/api/highlevelCompetition/${designation}`,
        {
          highlevelCompetition: value,
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

      // console.log("competition submitted:", response.data);
      setinnovationProjectMark(response.data.finalMarks);
    } catch (error) {
      console.error(
        "Error submitting funding amount:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    if (data?.innovationProject) {
      setSelectedValue(data.innovationProject.value);
      setinnovationProjectMark(data.innovationProject.marks ?? 0);
      setDesignationuser(data.designation);
      setName(data.facultyName);
      setId(data.employee._id);
      setFiles(data.innovationProject.innovationProjectFiles);
    }
  }, [data]);

  // call API when selectedValue changes (but skip initial mount)
  useEffect(() => {
    if (selectedValue && data?.innovationProject?.value !== selectedValue) {
      handleCompetitionTypeChange(selectedValue);
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
        {/* Left side */}
        <div className="first-container pr-3 border-r border-gray-400 col-span-10">
          <h1 className="text-lg font-medium">
            Involvement in High Level Competition / Innovative Projects.
            <span className="text-red-500">*</span>
          </h1>

          {/* Radio options */}
          <div className="radio-button-container space-y-2 px-2 py-2 rounded-lg mt-2 text-[#646464] font-medium">
            {competitionOptions.map((opt) => (
              <div key={opt.value} className="input-1 flex items-center gap-2">
                <input
                  type="radio"
                  name="competition"
                  value={opt.value}
                  checked={selectedValue === opt.value}
                  className="scale-125 accent-teal-400 cursor-pointer"
                  onChange={() =>
                    handleCompetitionTypeChange(opt.value, opt.mark)
                  }
                />
                <label className="text-gray-500">{opt.label}</label>
              </div>
            ))}
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

        {/* Right side */}
        <div className="second-container col-span-2 text-center">
          <h1 className="text-lg font-medium">Marks</h1>
          <div className="h-[80%] flex items-center justify-center">
            <h1 className="text-[#646464] text-lg">
              <span className="font-semibold text-[#318179]">
                {innovationProjectMark || 0}
              </span>{" "}
              out of {parsedMarkData?.points?.innovativeProjects || 0}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeachingForm8;
