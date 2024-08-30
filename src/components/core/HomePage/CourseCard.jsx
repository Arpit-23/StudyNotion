import React from 'react'
import { FaWpbeginner } from 'react-icons/fa'
import { TbBinaryTree2 } from 'react-icons/tb'

const CourseCard = ({cardData,currentCard,setCurrentCard}) => {
  return (
    <div className=''>
      <button onClick={() =>{setCurrentCard(cardData.heading)}}
      className={`flex flex-col w-[360px] lg-[30%] p-5 gap-1 ${currentCard===cardData.heading ?"bg-white text-richblack-700 shadow-[12px_12px_0_0] shadow-[#FFD60A]" :"bg-richblack-800" } transition-all duration-200 h-[300px] box-border cursor-pointer text-richblack-25`}>
        <div className='border-b-[2px] border-richblack-400 border-dashed h-[80%] p-6 flex flex-col gap-3'>
          <p className={`text-[20px] font-semibold text-start ${currentCard===cardData.heading  && "text-richblack-800"}`}>
            {cardData.heading}
          </p>
          <p className='text-richblack-400 text-start'>
          {cardData.description}
          </p>
        </div>
        <div className={`flex flex-row justify-between w-full ${currentCard === cardData.heading ? "text-blue-300" :"text-richblack-300"} px-3 py-3 font-medium`}>
          <div className='flex flex-row items-center gap-2 text-[16px]'>
            <FaWpbeginner className='text-lg' />
            <p>{cardData.level}</p>
          </div>
          <div className='flex flex-row items-center gap-2 text-[16px]'>
            <TbBinaryTree2 className='text-xl' />
            <p>{cardData.lessionNumber} Lessons</p>
          </div>
        </div>
      </button>
    </div>
  )
}

export default CourseCard