import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { getPasswordResetToken } from "../services/operations/authAPI";

const ForgotPassword = () => {
  const { loading } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [sentEmail, setSentEmail] = useState(false);
  const dispatch = useDispatch();

  function handleOnSubmit(e) {
    e.preventDefault();
    dispatch(getPasswordResetToken(email, setSentEmail));
  }
  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="max-w-[500px] p-4 lg:p-8">
          <h2 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
            {!sentEmail ? "Reset your password" : "Check email"}
          </h2>
          <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
            {!sentEmail
              ? "Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery"
              : `We have sent the reset email to ${email}`}
          </p>
          <form onSubmit={handleOnSubmit}>
            {!sentEmail && (
              <label className="w-full">
                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                  Email Address <span className=" text-pink-200">*</span>
                </p>
                <input
                  type="email"
                  value={email}
                  required
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="form-style w-full"
                  autoComplete="off"
                />
              </label>
            )}
            <button
              type="submit"
              className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900"
            >
              {!sentEmail ? "Submit" : "Resend Email"}
            </button>
          </form>
          <div className="mt-6 flex items-center justify-between">
            <Link to="/login">
              <p className="flex items-center gap-x-2 text-richblack-5">
                <BiArrowBack /> Back to login
              </p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
