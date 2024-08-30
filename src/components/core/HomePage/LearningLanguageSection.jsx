import React from 'react'
import HighlightText from './HighlightText'
import know_your_progress from "../../../assets/Images/Know_your_progress.png"
import compare_with_others from "../../../assets/Images/Compare_with_others.png"
import plan_your_lesson from "../../../assets/Images/Plan_your_lessons.png"
import CTAButtton from "../HomePage/Button"

const LearningLanguageSection = () => {
  return (
    <div className='my-10'>
        <div className='flex flex-col gap-5 items-center'>
            <div className='font-semibold text-4xl text-center'>
                Your Swiss Knife for
                <HighlightText text={" learning any language "} />
            </div>
            <div className='text-center text-richblack-600 mx-auto text-base  font-medium w-[70%]'>
                Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
            </div>
            <div className='flex flex-row items-center justify-center mt-5'>
                <img 
                    src={know_your_progress}
                    alt='know_your_progress'
                    className='object-contain -mr-32'
                />
                <img 
                    src={compare_with_others}
                    alt='compare_with_others'
                    className='object-contain'
                />
                <img 
                    src={plan_your_lesson}
                    alt='plan_your_lesson'
                    className='object-contain -ml-36'
                />
            </div>
            <div>
                <CTAButtton active={true} linkto={"/signup"}>
                    <div>
                        Learn More
                    </div>
                </CTAButtton>
            </div>
        </div>
    </div>
  )
}

export default LearningLanguageSection