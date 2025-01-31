import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ACCOUNT_TYPE } from "../../../utils/constants"
import { sendOtp } from "../../../services/operations/authAPI"
import { setSignupData } from "../../../slices/authSlice"


const SignupForm = ({ setIsLoggedIn }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    })


    const [showCreatePass, setShowCreatePass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT);

    function changeHandler(event) {

        setFormData((prev) => ({
            ...prev,
            [event.target.name]: event.target.value
        }))
    }

    function submitHandler(event) {
        event.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("Password do not match");
            return;
        }
        const signupData = {
            ...formData,
            accountType,
          }
        
            // Setting signup data to state
            // To be used after otp verification
            dispatch(setSignupData(signupData))
            // Send OTP to user for verification
            dispatch(sendOtp(formData.email, navigate))

            // Reset
            setFormData({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            })
            setAccountType(ACCOUNT_TYPE.STUDENT)

    }

    return (
        <div className="flex flex-col gap-3">

            <div  className="flex bg-richblack-800 p-1 gap-x-1 rounded-full max-w-max my-6">
                <button
                    className={`${accountType === "student"
                            ? "bg-richblack-900 text-richblack-5"
                            : "bg-transparent text-richblack-200"} py-2 px-5 rounded-full transition-all duration-200`}
                    onClick={() => setAccountType("student") }>
                    Student
                </button>
                <button
                    className={`${accountType === "instructor"
                            ? "bg-richblack-900 text-richblack-5"
                            : "bg-transparent text-richblack-200"} py-2 px-5 rounded-full transition-all duration-200`}
                    onClick={() => setAccountType("instructor")}>
                    Instructor
                </button>
            </div>
            <form onSubmit={submitHandler}>
                <div className="flex gap-x-6">
                    <label htmlFor="" className="w-full">
                        <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
                            First Name <sup className="text-pink-200">*</sup>
                        </p>
                        <input
                            type="text"
                            required
                            placeholder="Enter First Name"
                            onChange={changeHandler}
                            value={formData.firstName}
                            name="firstName"
                            className="bg-richblack-800 rounded-[0.75rem] w-full p-[12px] text-richblack-5"
                        />
                    </label>

                    <label htmlFor="" className="w-full">
                        <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
                            Last Name <sup className="text-pink-200">*</sup>
                        </p>
                        <input
                            type="text"
                            required
                            placeholder="Enter Last Name"
                            onChange={changeHandler}
                            value={formData.lastName}
                            name="lastName"
                            className="bg-richblack-800 rounded-[0.75rem] w-full p-[12px] text-richblack-5"
                        />
                    </label>
                </div>

                <label htmlFor="" className="w-full">
                    <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
                        Email Address
                        <sup className="text-pink-200">*</sup>
                    </p>

                    <input
                        type="email"
                        required
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={changeHandler}
                        className="bg-richblack-800 rounded-[0.75rem] w-full p-[12px] text-richblack-5"
                        name="email"
                    />
                </label>

                <div className="flex gap-x-4 justify-between w-full">
                    <label className="w-1/2 relative">
                        <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
                            Create Password
                            <sup className="text-pink-200">*</sup>
                        </p>

                        <input
                            type={showCreatePass ? "text" : "password"}
                            required
                            placeholder="Enter Password"
                            onChange={changeHandler}
                            value={formData.password}
                            name="password"
                            className="bg-richblack-800 rounded-[0.75rem] w-full p-[12px] text-richblack-5"
                        />
                        <span
                            onClick={() => setShowCreatePass(!showCreatePass)}
                            className="absolute right-3 top-[38px] cursor-pointer z-10"
                        >
                            {showCreatePass ? (
                                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                            ) : (
                                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                            )}
                        </span>
                    </label>

                    <label htmlFor="" className="w-1/2 relative">
                        <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
                            Confirm Password
                            <sup className="text-pink-200">*</sup>
                        </p>

                        <input
                            type={showConfirmPass ? "text" : "password"}
                            required
                            placeholder="Confirm Password"
                            onChange={changeHandler}
                            value={formData.confirmPassword}
                            name="confirmPassword"
                            className="bg-richblack-800 rounded-[0.75rem] w-full p-[12px] text-richblack-5"
                        />

                        <span
                            onClick={() => setShowConfirmPass(!showConfirmPass)}
                            className="absolute right-3 top-[38px] cursor-pointer z-10"
                        >
                            {showConfirmPass ? (
                                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                            ) : (
                                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                            )}
                        </span>
                    </label>
                </div>

                <button className="bg-yellow-50 py-[8px] px-[12px] rounded-[8px] mt-6 font-medium text-richblack-900 w-full">
                    Create Account
                </button>
            </form>

        </div>
    );
}


export default SignupForm;