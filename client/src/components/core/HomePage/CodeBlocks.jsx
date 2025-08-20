import React from 'react'
import CTAButton from "../HomePage/Button"
import HighlightText from "../HomePage/HighlightText"
import { FaArrowRight } from 'react-icons/fa'
import { TypeAnimation } from 'react-type-animation'

const CodeBlocks = ({position,heading,subheading,ctabtn1,ctabtn2,backgroundGradient ,codeColor,codeblock}) => {
  return (
    <div className={`flex ${position} my-20 justify-between gap-10`}>
        {/* section1 */}
        <div className='w-[50%] flex flex-col gap-8'>
            {heading}
            <div className='text-richblac-300 font-bold'>
                {subheading}
            </div>
            <div className='flex gap-7 mt-7'>
            <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
                <div className='flex gap2 items-center'>
                    {ctabtn1.btnText}
                    <FaArrowRight />
                </div>
            </CTAButton>
            <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
                <div className='flex gap2 items-center'>
                    {ctabtn2.btnText}
                </div>
            </CTAButton>
            </div>
        </div>

        {/* Seciton2 */}
        <div className='h-fit code-border flex flex-row text-[10px] sm:text-sm leading-[18px] sm:leading-6 relative w-[100%] py-4 lg:w-[470px]'>
            {/* HW background gradient */}
            {backgroundGradient}
            <div className='text-center select-none flex flex-col w-[10%] text-richblack-400 font-inter font-bold'>
                <p>1</p>
                <p>2</p>
                <p>3</p>
                <p>4</p>
                <p>5</p>
                <p>6</p>
                <p>7</p>
                <p>8</p>
                <p>9</p>
                <p>10</p>
                <p>11</p>
            </div>
            <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-1`}>
                <TypeAnimation 
                    sequence={[codeblock,1000,""]}
                    repeat={Infinity}
                    cursor={true}
                    style ={
                        {
                            whiteSpace:"pre-line",
                        display:"block",
                        }
                    }
                    omitDeletionAnimation={true}
                />
            </div>
        </div>
    </div>
  )
}

export default CodeBlocks