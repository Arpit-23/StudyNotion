const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");
const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 60 * 5,
  },
});

//a function to send emails
async function sendVerificactionEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email",
      emailTemplate(otp)
    );
    console.log("Email sen Successfully: ", mailResponse);
  } catch (error) {
    console.log("Error occured while sending mails: ", error);
    throw error;
  }
}

OTPSchema.pre("save", async function (next) {
  // if(this.isNew)
  await sendVerificactionEmail(this.email, this.otp);

  next();
});

module.exports = mongoose.model("OTP", OTPSchema);
