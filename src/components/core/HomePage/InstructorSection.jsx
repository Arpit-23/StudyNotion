import React from 'react'
import Instructor from "../../../assets/Images/Instructor.png"
import HighlightText from './HighlightText'
import CTAButton from "./Button"
import { FaArrowRight } from 'react-icons/fa'

const InstructorSection = () => {
  return (
    <div className=''>
        <div className='flex flex-col lg:flex-row gap-20  items-center'>
            <div className='lg:w-[50%]'>
                <img 
                    src={Instructor}
                    className='shadow-white shadow-[-20px_-20px_0_0]'
                />
            </div>
            <div className='lg:w-[50%] flex flex-col gap-10'>
                <div className='lg:w-[50%] text-4xl font-semibold'>
                    Become an
                    <HighlightText text={"Instructor"} />
                </div>
                <p className='font-medium text-[16px] text-justify w-[90%] text-richblack-300'>
                    Instructor from around the world teach millions of students on StudyNotion. We provide the 
                    tools and skills to teach what you love.
                </p>
                <div className='w-fit'>
                    <CTAButton active={true} linkto={"/signup"}>
                        <div className='flex gap-2 items-center'>
                            Start Teaching Today
                            <FaArrowRight />
                        </div>
                    </CTAButton>
                </div>
               
            </div>
        </div>
    </div>
  )
}

export default InstructorSection