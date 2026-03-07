import { UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // ✅ works with v4+
import axios from "axios";
import { useParams } from "react-router-dom";
import fileIcon from "../../assets/file_icon.svg";

const TeachingForm7 = ({ data }) => {
 const API = import.meta.env.VITE_API
  const [lakhsTypemark, setLakhsTypemark] = useState(0);
  const [files, setFiles] = useState([data?.fdpFunding.fdpFundingFiles || []]);
  // states
  const [selectedValue, setSelectedValue] = useState();
  const [fdpFundingMark, setfdpFundingMark] = useState(data.fdpFunding.marks ?? 0);
  const [designationuser, setDesignationuser] = useState();
  const [name, setName] = useState();
  const [id, setId] = useState();

  // decode token
  const token = localStorage.getItem("appraisal_token");
  const decoded = token ? jwtDecode(token) : {};
  const designation = decoded?.designation;
  const markdata = localStorage.getItem("appraisal_outofmark");
  // Parse the string into an object
  const parsedMarkData = JSON.parse(markdata);

  const handleLakhsTypeChange = async (value) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/api/fdpFunding/${designation}`,
        {
          FdpFunding: value,
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

      // // console.log("Funding amount submitted:", response.data);
      setfdpFundingMark(response.data.finalMarks);
    } catch (error) {
      console.error(
        "Error submitting funding amount:",
        error.response?.data || error.message
      );
    }
  };
  // set initial value from props
  useEffect(() => {
    if (data?.fdpFunding) {
      setSelectedValue(data.fdpFunding.value);
      setfdpFundingMark(data.fdpFunding.marks ?? 0);
      setDesignationuser(data.designation);
      setName(data.facultyName);
      setId(data.employee._id);
      setFiles(data.fdpFunding.fdpFundingFiles);
    }
  }, [data]);

  // call API when selectedValue changes (but skip initial mount)
  useEffect(() => {
    if (selectedValue && data?.fdpFunding?.value !== selectedValue) {
      handleLakhsTypeChange(selectedValue);
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
    <>
      <div className="main-container border p-5 border-[#AAAAAA] bg-white rounded-xl ">
        <div className="input-container-3 grid gap-4 grid-cols-12">
          <div className="first-container pr-3 border-r border-gray-400 col-span-10">
            <div>
              <h1 className="text-lg font-medium">
                Organizing Faculty Development Programs, Seminars, Workshops and
                Conferences with funding.
                <span className="text-red-500">*</span>
              </h1>
            </div>

            {/* ================= Radio Buttons ================= */}
            <div className="radio-button-container space-y-2 px-2 py-2 rounded-lg mt-2 text-[#646464] font-medium">
              <div className="input-1 flex items-center gap-2">
                <input
                  type="radio"
                  name="fdp"
                  value="less than 1 lakh"
                  checked={selectedValue === "less than 1 lakh"}
                  className="scale-125 accent-teal-400 cursor-pointer"
                  onChange={() => {
                    setSelectedValue("less than 1 lakh");
                    setLakhsTypemark(5);
                  }}
                />
                <label className="text-gray-500">&lt; 1 Lakh</label>
              </div>

              <div className="input-1 flex items-center gap-2">
                <input
                  type="radio"
                  name="fdp"
                  value="1-2 lakh"
                  checked={selectedValue === "1-2 lakh"}
                  className="scale-125 accent-teal-400 cursor-pointer"
                  onChange={() => {
                    setSelectedValue("1-2 lakh");
                    setLakhsTypemark(10);
                  }}
                />
                <label className="text-gray-500">1 - 2 Lakhs</label>
              </div>

              <div className="input-1 flex items-center gap-2">
                <input
                  type="radio"
                  name="fdp"
                  value="greater than 2 lakh"
                  checked={selectedValue === "greater than 2 lakh"}
                  className="scale-125 accent-teal-400 cursor-pointer"
                  onChange={() => {
                    setSelectedValue("greater than 2 lakh");
                    setLakhsTypemark(15);
                  }}
                />
                <label className="text-gray-500">&gt; 2 Lakhs</label>
              </div>

              <div className="input-1 flex items-center gap-2">
                <input
                  type="radio"
                  name="fdp"
                  value="None"
                  checked={selectedValue === "None"}
                  className="scale-125 accent-teal-400 cursor-pointer"
                  onChange={() => {
                    setSelectedValue("None");
                    setLakhsTypemark(0);
                  }}
                />
                <label className="text-gray-500">None</label>
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
                    <h1 className="truncate max-w-xs">
                      {fileName.slice(0, 15)}
                    </h1>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ================= Marks Section ================= */}
          <div className="second-container col-span-2 text-center">
            <h1 className="text-lg font-medium">Marks</h1>
            <div className="h-[80%] flex items-center justify-center">
              <h1 className="text-[#646464] text-lg">
                <span className="font-semibold text-[#318179]">
                  {fdpFundingMark || 0}
                </span>{" "}
                out of {parsedMarkData?.points?.fdpFunding || 0}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeachingForm7;
