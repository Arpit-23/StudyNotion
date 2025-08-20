import React from 'react'
import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg"
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg"
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg"
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg"
import timelineImage from "../../../assets/Images/TimelineImage.png"

const timeline =[
    {
        Logo:Logo1,
        heading:"Leadership",
        Descriptin:"Fully commited to the success company",
    },
    {
        Logo:Logo2,
        heading:"Leadership",
        Descriptin:"Fully commited to the success company",
    },
    {
        Logo:Logo3,
        heading:"Leadership",
        Descriptin:"Fully commited to the success company",
    },
    {
        Logo:Logo4,
        heading:"Leadership",
        Descriptin:"Fully commited to the success company",
    },
]
const TimelineSection = () => {
  return (
    <div>
         <div className='flex flex-col lg:flex-row gap-20 mb-20 items-center'>
            <div className='flex flex-col lg:w-[45%] gap-14 lg:gap-3'>
                {
                    timeline.map((element,index) =>{
                        return (
                            <div className='flex flex-col  lg:gap-3' key={index}>
                                <div className='flex gap-6' key={index}>
                                <div className='w-[52px] h-[52px] bg-white  rounded-full flex justify-center items-center shadow-[#00000012] shadow-[0_0_62px_0]'>
                                    <img src={element.Logo} />
                                </div>
                                <div>
                                    <h2 className='font-semibold text-[18px]'>{element.heading}</h2>
                                    <p className='text-base'>{element.Descriptin}</p>
                                </div>
                                </div>
                                <div className={`hidden ${timeline.length-1 == index ?"hidden" : "lg:block" }
                                h-14  border-dotted border-r border-richblack-100 bg-richblack-400/0 w-[26px]`}>

                                </div>

                            </div>
                        )
                    })
                }
            </div>
            <div className='relative w-fit h-auto shadow-blue-200 shadow-[0px_0px_30px_0px]'>
                <img src={timelineImage} 
                    alt='timelineImage'
                    className='shadow-white object-cover shadow-[20px_20px_0px_0px] h-[400px] lg:h-fit'
                />
                <div className='absolute bg-caribbeangreen-700 flex flex-row text-white uppercase py-7 lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[-50%]'>
                <div className='flex flex-row gap-5 items-center border-r border-caribbeangreen-300 px-7'>
                    <h2 className='text-3xl font-bold'>10</h2>
                    <h2 className='text-caribbeangreen-300 text-sm'>Years of Experience</h2>
                </div>
                <div className='flex gap-5 items-center px-7'>
                    <h2 className='text-3xl font-bold'>250</h2>
                    <h2 className='text-caribbeangreen-300 text-sm'>Type of Courses</h2>
                </div>

                </div>
            </div>
         </div>
    </div>
  )
}

export default TimelineSection