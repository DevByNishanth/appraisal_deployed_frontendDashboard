import React, { useContext, useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import FormHeader from "../Components/FormHeader";
import { ChevronRight } from "lucide-react";
import TeachingForm from "../Components/TeachingForm/TeachingForm";
import { jwtDecode } from "jwt-decode";
import { Data } from "../Context/store.js";

const FormPage = () => {
  // Auth
  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const username = decoded.facultyName;

  // Context Data's
  const { canditateData } = useContext(Data);
  console.log("nameeeeeeeeeeeeeeeeeee-------------->",canditateData)
  // states

  // useEffect calls
  // functions
  return (
    <>
      <div className="main-container grid grid-cols-12">
        <div className="sidebar-container col-span-2">
          <Sidebar />
        </div>
        <div className="main-content-container col-span-10">
          <FormHeader />
          <div className="form-headerx px-4 pt-2">
            <div className="flex gap-2 items-center">
              <h1 className="font-semibold">Appraisal Form</h1>
              <span>
                <ChevronRight className="w-4 h-4 mt-1" />
              </span>
              <h1 className="font-semibold ">Teaching</h1>
              <span>
                <ChevronRight className="w-4 h-4 mt-1" />
              </span>
              <h1 className="font-semibold text-[#318179]">
                {canditateData.facultyName}
              </h1>
            </div>
          </div>
          <TeachingForm />
        </div>
      </div>
    </>
  );
};

export default FormPage;
