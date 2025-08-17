const bcrypt = require("bcrypt");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const crypto = require("crypto");

//reset password token
exports.resetPasswordToken = async (req, res) => {
  try {
    //get email from req body
    const email = req.body.email;
    //check user for this, email validation
    const user = User.findOne({ email: email });
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Your email is not registered with us",
      });
    }
    //generate token
    const token = crypto.randomUUID();
    //update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );

    //create link
    const url = `http://localhost:3000/update-password/${token}`;
    console.log("Print Email Link ----> ", url);
    //send mail containing the url
    await mailSender(
      email,
      "PASSWORD RESET LINK",
      `Password Reset Link ${url}`
    );

    //return response
    res.status(200).json({
      success: true,
      message:
        "Email send successfully, please check email and change password",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while send reset password email",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    //data fetch
    const { password, confirmPassword, token } = req.body;
    //validation
    if (password !== confirmPassword) {
      res.json({
        success: false,
        message: "Password not matching",
      });
    }
    //get userdetails from db using token
    const userDetails = User.findOne({ token: token });

    //if no entry -token invalid
    if (!userDetails) {
      res.json({
        success: false,
        message: "Token is invalid",
      });
    }

    //token time check
    if (userDetails.resetPasswordExpires < Date.now()) {
      res.json({
        success: false,
        message: "Token is expire, please regenerate it ",
      });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //password update
    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );

    //response
    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while send reset password email",
    });
  }
};
