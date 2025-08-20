import React from "react";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import framImage from "../../../assets/Images/frame.png";
import { useSelector } from "react-redux";

const Template = ({ title, desc1, desc2, image, formType }) => {
  const { loading } = useSelector((state) => state.auth);
  return (
    <div className="grid min-h-[calc(100vh-3,5rem)] place-items-center">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="flex w-11/12 max-w-[1160px] py-12 mx-auto gap-x-12 justify-between gap-y-0">
          <div className="w-11/12 max-w-[450px] mx-0 text-white">
            <h1 className="text-richblack-5 font-semibold text-[1.875rem] leading-[2.375rem]">
              {title}
            </h1>
            <p className="text-[1.125rem] leading-[1.625rem] mt-4">
              <span className=" text-richblack-100">{desc1}</span>
              <br />
              <span className="text-blue-100 italic text-[1rem]">{desc2} </span>
            </p>
            {formType === "signup" ? <SignupForm /> : <LoginForm />}
          </div>
          <div className="relative w-11/12 max-w-[450px] mx-auto md:mx-0">
            <img
              className=""
              src={framImage}
              alt="pattern"
              width={558}
              height={504}
              loading="lazy"
            />
            <img
              className="absolute -top-4 right-4"
              src={image}
              alt="student"
              width={558}
              height={504}
              loading="lazy"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Template;
