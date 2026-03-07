import React, { useContext } from 'react'

import no_data from '../assets/no_data_found.jpg'
import * as motion from "motion/react-client";
import employee_img from "../assets/employee_img.svg";
import chevron_left from "../assets/chevron_left.svg";
import { Data } from '../Context/store.js';



const VerifiedCard = () => {
    const {verifedData, filteredVerifiedData} = useContext(Data)
  // console.log("Verifed  askdjnask data : ", filteredVerifiedData)
  return (
    <>
      {filteredVerifiedData?.length == 0 ? <div className='text-center h-[300px] flex items-center justify-center'>
        <div>
          <img src={no_data} className='w-[200px] m-auto mt-4' />
          <h1 className='font-semibold text-lg text-[#777777]'>No data found</h1>
        </div>
      </div> : ""}
      <section className='card-container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-5 max-h-[500px] overflow-auto'>
        {filteredVerifiedData?.map((item, index) => {
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
              <button className="bg-[#318179] text-white w-full py-2 rounded-md font-semibold text-sm hover:bg-[#0d3f3a] cursor-pointer transition flex items-center justify-center">
                Verify
                <span className="">
                  <img src={chevron_left} />
                </span>
              </button>
            </motion.div>
          )
        })}
      </section>
    </>
  )
}

export default VerifiedCard