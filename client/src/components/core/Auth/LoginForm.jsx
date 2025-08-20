import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { login } from "../../../services/operations/authAPI";
const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });

  function formDataHandler(event) {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }

  const [showPassword, setShowPassword] = useState(false);

  function submitHandler(event) {
    event.preventDefault();
    dispatch(login(formData.email, formData.password, navigate));
  }
  return (
    <form
      className="flex flex-col w-full gap-y-4 mt-6"
      onSubmit={submitHandler}
    >
      <label className="w-full">
        <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
          Email Address<sup className="text-pink-200">*</sup>
        </p>
        <input
          required
          type="email"
          value={formData.email}
          onChange={formDataHandler}
          placeholder="Enter email address"
          name="email"
          autoComplete="offf"
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255,255,255,0.18)",
          }}
          className="bg-richblack-800 rounded-[0.5rem] w-full p-[12px] text-richblack-5"
        />
      </label>

      <label className="relative">
        <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
          Password<sup className="text-pink-200">*</sup>
        </p>
        <input
          required
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={formDataHandler}
          placeholder="Enter Password"
          name="password"
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255,255,255,0.18)",
          }}
          autoComplete="off"
          className="bg-richblack-800 rounded-[0.5rem] w-full p-[12px] text-richblack-5"
        />

        <span
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-[38px] z-[10] cursor-pointer "
        >
          {showPassword ? (
            <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
          ) : (
            <AiOutlineEye fontSize={24} fill="#AFB2BF" />
          )}
        </span>

        <Link to="/forgot-password">
          <p className="text-xs mt-1  text-blue-100 max-w-max ml-auto">
            Forgot Password
          </p>
        </Link>
      </label>

      <button
        type="submit"
        className="bg-yellow-50 py-[8px] px-[12px] rounded-[8px] mt-6 font-medium text-richblack-900"
      >
        Sign In
      </button>
    </form>
  );
};

export default LoginForm;
