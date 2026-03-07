import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // ✅ works with v4+
import axios from "axios";

import { useParams } from "react-router-dom";

const TeachingForm3 = ({ data }) => {
 const API = import.meta.env.VITE_API

  // Label data
  const labelData = [
    { label: "91% to 100%", value: "100 to 91", mark: 3 },
    { label: "81% to 90%", value: "90 to 81", mark: 2 },
    {
      label: "Less than or equal to 80%",
      value: "Less than or equal to 80",
      mark: 1,
    },
    { label: "None", value: "None", mark: 0 },
  ];

  // states

  const [selectedValue, setSelectedValue] = useState(() => {
    data?.innovativeApproach?.value;
  });
  console.log("dat : ", data.innovativeApproach);
  const [feedbackMark, setFeedbackMark] = useState(0);
  const [designationuser, setDesignationuser] = useState();
  const [name, setName] = useState();
  const [id, setId] = useState();

  // decode token
  const token = localStorage.getItem("appraisal_token");
  const markdata = localStorage.getItem("appraisal_outofmark");
  // Parse the string into an object
  const parsedMarkData = JSON.parse(markdata);

  // Now you can access studentFeedback

  const decoded = token ? jwtDecode(token) : {};
  const designation = decoded?.designation;

  // destructuring Data from URL
  const { form_id } = useParams();
  // handle API call
  const handleApiCall = async (value) => {
    console.log("value=====>", value);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/api/feedback/${designation}`,
        {
          feedback: value,
          facultyName: name,
          employeeId: id,
          designation: designationuser,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFeedbackMark(response.data.finalMarks);
    } catch (error) {
      console.error("Error submitting teaching percentage:", error);
    }
  };

  // handle radio selection
  const handleSelection = (option) => {
    setSelectedValue(option.value);
    setFeedbackMark(option.mark);
  };

  // set initial value from props
  useEffect(() => {
    if (data?.feedback) {
      setSelectedValue(data.feedback.value);
      setFeedbackMark(data.feedback.marks ?? 0);
      setDesignationuser(data.designation);
      setName(data.facultyName);
      setId(data.employee._id);
    }
  }, [data]);

  // call API when selectedValue changes (but skip initial mount)
  useEffect(() => {
    if (selectedValue && data?.feedback?.value !== selectedValue) {
      handleApiCall(selectedValue);
    }
  }, [selectedValue]);

  return (
    <div className="main-containear">
      <div className="input-container-3 border p-5 border-[#AAAAAA] bg-white rounded-xl grid gap-4 grid-cols-12">
        {/* Left side */}
        <div className="first-container pr-3 border-r border-gray-400 col-span-10">
          <div>
            <h1 className="text-lg font-medium">
              The average student feedback for all Theory / Lab classes
              <span className="text-red-500">*</span>
            </h1>
            <h1 className="text-lg text-[#646464] font-medium text-[16px] mt-1">
              100 to 91 – 03 Points || 90 to 81 – 02 Points || &lt;= 80 – 01
              Point
            </h1>
          </div>

          {/* Radio buttons */}
          <div className="radio-button-container space-y-2 px-2 py-2 rounded-lg mt-2 text-[#646464] font-medium">
            {labelData.map((option) => (
              <div
                key={option.value}
                className="input-1 flex items-center gap-2"
              >
                <input
                  type="radio"
                  checked={selectedValue === option.value}
                  onChange={() => handleSelection(option)}
                  className="scale-125 accent-teal-400 cursor-pointer "
                />
                <label className="text-gray-500">{option.label}</label>
              </div>
            ))}
          </div>
        </div>
        {/* Right side */}
        <div className="second-container col-span-2 text-center">
          <h1 className="text-lg font-medium">Marks</h1>
          <div className="h-[80%] flex items-center justify-center">
            <h1 className="text-[#646464] text-lg">
              <span className="font-semibold text-[#318179]">
                {feedbackMark}
              </span>{" "}
              out of{parsedMarkData?.points?.studentFeedback || 0}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeachingForm3;
