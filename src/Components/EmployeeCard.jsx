import { useContext, useEffect, useState } from "react";
import axios from "axios";
import employee_img from "../assets/employee_img.svg";
import chevron_left from "../assets/chevron_left.svg";
import no_data from "../assets/no_data_found.jpg";
import * as motion from "motion/react-client";
import { Data } from "../Context/store.js";
import { Link } from "react-router-dom";

const employee_card_data = [
  { profile_img: employee_img, name: "John Dev", desigation: "Professor" },
  { profile_img: employee_img, name: "John Dev", desigation: "Professor" },
  {
    profile_img: employee_img,
    name: "John Dev",
    desigation: "Assistant Professor",
  },
  { profile_img: employee_img, name: "John Dev", desigation: "Professor" },
  {
    profile_img: employee_img,
    name: "John Dev",
    desigation: "Associate Professor",
  },
  { profile_img: employee_img, name: "John Dev", desigation: "Professor" },
  { profile_img: employee_img, name: "John Dev", desigation: "Professor" },
  { profile_img: employee_img, name: "John Dev", desigation: "Professor" },
  { profile_img: employee_img, name: "John Dev", desigation: "Professor" },
  { profile_img: employee_img, name: "John Dev", desigation: "Professor" },
  { profile_img: employee_img, name: "John Dev", desigation: "Professor" },
];

export default function EmployeeCard({ setNeedToVerifyCount, setVerifiedCount,  }) {
  // states 
  const [loading, setLoading] = useState(true);

  // Context API data 
  const { forms, setForms, filteredData, setVerifiedData } = useContext(Data)


  useEffect(() => {
    const fetchForms = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem("appraisal_token");
        const response = await axios.get(
          `${import.meta.env.VITE_API}/api/getForms`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("form data  : ", response.data)
        setForms(response.data.notVerified);
        setVerifiedData(response.data.verified)
      } catch (error) {
        setLoading(false)
        console.error("Error fetching forms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  useEffect(() => {
    setNeedToVerifyCount(forms.length)
  }, [forms])

  return (
    <>
      {loading && filteredData.length == 0 ? <div className="loader-container h-[300px] flex items-center justify-center">
        <div className="loader m-auto"></div>
      </div> : ""}
      <div className="card-container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-5 max-h-[500px] overflow-auto ">
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => {
            return (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  scale: { visualDuration: 0.4, bounce: 0.2 },
                }}
                className="bg-white shadow-md shadow-gray-300 border-1 border-gray-200 rounded-xl p-6 text-center flex flex-col items-center"
              >
                <img
                  src={employee_img}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover mb-4"
                />
                <h2 className="text-lg font-semibold text-gray-900">
                  {item.employee.fullName}
                </h2>
                <p className="text-gray-500 text-sm mb-4">{item.employee.designation}</p>
                {/* {console.log("card data : ", item)} */}
                <Link to={`/appraisal_form/form/${item._id}`} className="bg-[#318179] text-white w-full py-2 rounded-md font-semibold text-sm hover:bg-[#0d3f3a] cursor-pointer transition flex items-center justify-center">
                  Verify
                  <span className="">
                    <img src={chevron_left} />
                  </span>
                </Link>
              </motion.div>
            )
          })
        ) : (
          <div className={`${loading == true ? "hidden" : ""}  `}>
            <div className="text-center ">
              <img src={no_data} className="" />
              <p className="text-[#777777] text-lg">No data found</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
