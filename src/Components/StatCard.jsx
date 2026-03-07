import React, { useState, useEffect, useRef, useContext } from "react";
import card_img_1 from "../assets/card_img_1.svg";
import card_img_2 from "../assets/card_img_2.svg";
import card_img_3 from "../assets/card_img_4.1.svg";
import card_img_4 from "../assets/card_img_4.svg";
import card_img_5 from "../assets/card_img_5.svg";
import icon1 from "../assets/person_icon1.svg";
import icon2 from "../assets/person_icon2.svg";
import icon3 from "../assets/person_icon3.svg";
import icon5 from "../assets/person_icon5.svg";
import icon6 from "../assets/person_icon6.svg";
import * as motion from "motion/react-client";
import axios from "axios";
import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts";
import { jwtDecode } from "jwt-decode";
import { Data } from "../Context/store.js";
const COLORS = ["#2986CE", "#E0F2FE"]; // blue + light blue
// const [tableData, setTableData] = useState("");

const API = import.meta.env.VITE_API
const token = localStorage.getItem("appraisal_token");
let username = "";
if (token) {
  try {
    const decoded = jwtDecode(token);
    username = decoded.facultyName;
  } catch (error) {
    console.error("Invalid token:", error);
  }
}
// console.log("name : ", username);
const StatCard = () => {
  const { setSelectedDesignation } = useContext(Data);

  const value = 84; // dynamic value
  const data = [
    { name: "completed", value: value },
    { name: "remaining", value: 100 - value },
  ];
  useEffect(() => {
    fetchData();
  }, [token]);

  // functions

  const [stats, setStats] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/api/total_employees`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStats(response.data); // store the API response
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };
  const statCardData = stats
    ? [
        {
          bg_img: card_img_1,
          icon: icon1,
          title: "Employees",
          value: stats?.totalEmployees,
          parameter: "",
        },
        {
          bg_img: card_img_2,
          icon: icon2,
          title: "Professors",
          value: stats?.professorCount,
          parameter: "Professor",
        },
        {
          bg_img: card_img_4,
          icon: icon5,
          title: "Associate Professors",
          value: stats?.associateProfessorCount,
          parameter: "Associate Professor",
        },
        {
          bg_img: card_img_3,
          icon: icon3,
          title: "Assistant Professors",
          value: stats?.assistantProfessorCount,
          parameter: "Assistant Professor",
        },
        {
          bg_img: card_img_5,
          icon: icon6,
          title: "Total Form Submitted",
          value: stats?.formSubmissionPercentage,
        },
      ]
    : [];

  const handleFilterDropdown = () => {
    setFilterDropdown(!filterDropdown);
  };
  return (
    <>
      <div className="main-container px-6 mt-3">
        <div className="header ">
          <h1 className="font-medium text-gray-900 text-lg">
            Hello {username} 👋🏻
          </h1>
          <h1 className="text-gray-600">
            Welcome to your appraisal dashboard. Track employee submissions and
            performance at a glance.
          </h1>
        </div>
        <div className="card-container mt-4 flex gap-4 items-start">
          {statCardData.map((item, index) => {
            return (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.4,
                    scale: { visualDuration: 0.4, bounce: 0.2 },
                  }}
                  className="card h-[130px] cursor-pointer "
                  onClick={() => setSelectedDesignation(item.parameter)}
                >
                  <div className="img-container h-[100%] w-[100%] relative">
                    <img src={item.bg_img} className="w-[100%] h-[100%]" />
                    <div className="icon-container w-fit absolute top-4 left-4">
                      <img src={item.icon} className="w-10 h-10" />
                    </div>
                    <div className="content-container absolute left-4 top-16 text-gray-900 font-semibold ">
                      <h1 className="text-sm font-medium">{item.title}</h1>
                      <h1>{item.value}</h1>
                    </div>
                  </div>
                </motion.div>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default StatCard;
