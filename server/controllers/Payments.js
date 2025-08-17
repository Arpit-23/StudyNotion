const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const mongoose = require("mongoose");
const crypto = require("crypto");
const paymentSuccessEmail = require("../mail/templates/paymentSuccessEmail");
const courseProgress = require("../models/CourseProgress");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");

//capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
  //get userId and CourseId
  const { courses } = req.body;
  const userId = req.user.id;
  //validation
  if (courses.length === 0) {
    return res.json({ success: false, message: "Please Provide Course ID" });
  }

  let total_amount = 0;
  //valid courseId

  for (const course_id of courses) {
    let course;
    try {
      course = await Course.findById(course_id);
      if (!course) {
        return res.json({
          success: false,
          message: "Could not find the course",
        });
      }
      //user already pay for the same course
      const uid = new mongoose.Types.ObjectId(userId); //this line is writen because of that we convert string id to the type _id

      if (course.studentsEnrolled.includes(uid)) {
        return res.status(200).json({
          success: true,
          message: "Student is already enrolled",
        });
      }
      // Add the price of the course to the total amount
      total_amount += course.price;
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  //order create

  const options = {
    amount: total_amount * 100,
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
  };
  try {
    //intitiate the payment using razorpay
    const paymentResponse = await instance.orders.create(options);
    return res.status(200).json({
      success: true,
      data: paymentResponse,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Could not initiate order",
    });
  }
};

//verify signature of Razorpay and Server
exports.verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const courses = req.body?.courses;

  const userId = req.user.id;
  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(200).json({ success: false, message: "Payment Failed" });
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    await enrollStudents(courses, userId, res);
    return res.status(200).json({ success: true, message: "Payment Verified" });
  }

  return res.status(200).json({ success: false, message: "Payment Failed" });
};

//Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;

  const userId = req.user.id;

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" });
  }
  try {
    const enrolledStudent = await User.findById(userId);

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    );
  } catch (error) {
    console.log("Error in sending mail", error);
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" });
  }
};

//enroll the student in the courses
const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please Provide Course ID and User ID",
    });
  }

  for (const courseId of courses) {
    try {
      //Find the course and enroll the student in it
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );
      if (!enrolledCourse) {
        return res
          .status(500)
          .json({ success: false, error: "Course not found" });
      }

      const courseprogress = await courseProgress.create({
        courseID: courseId,
        userId: userId,
        completeVideos: [],
      });

      //Find the student and add the course to their lis of enrolled courses
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress: courseprogress._id,
          },
        },
        { new: true }
      );
      // Send an email notification to the enrolled student
      const emailResponse = await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
        )
      );
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error: error.message });
    }
  }
};
