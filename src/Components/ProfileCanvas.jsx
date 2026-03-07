import { X } from "lucide-react";
import React from "react";
import employee_img from "../assets/employee_img.svg";
const ProfileCanvas = () => {
  return (
    <>
      <div className="main-container w-[360px] rounded-lg h-[95vh] bg-white absolute top-3  bottom-3 right-4 z-50">
        <div className="header px-4 py-2 border-b-1 border-gray-400 flex  items-center justify-between">
          <h1 className="font-medium text-lg">Profile</h1>
          <div className="icon-container  border-1 border-gray-200 rounded-full w-fit p-1 hover:bg-gray-200 cursor-pointer">
            <X className="" />
          </div>
        </div>
        <div className="content-container mx-4 mt-4">
          <div className="img-container">
            <img
              src={employee_img}
              className="rounded-full w-[120px] h-[120px]"
            />
          </div>
          <div className="content mt-3 text-lg">
            <h1 className="text-gray-500 ">Name</h1>
            <h1 className="font-medium ">Nishanth</h1>
          </div>
          <div className="content mt-3 text-lg">
            <h1 className="text-gray-500 ">Designation</h1>
            <h1 className="font-medium ">Professor</h1>
          </div>
        </div>
      </div>
      <div className="tint fixed top-0 right-0 left-0 bottom-0"></div>
    </>
  );
};

export default ProfileCanvas;
