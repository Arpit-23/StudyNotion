const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");

//capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res)=>{
    try{
        //get userEd and CoourseId
        const {course_id} = req.body;
        const userId = req.user.id;
        //validation
        //valid courseId
        if(!course_id){
            return res.json({
                success:false,
                message:"please provide valid course Id",
            })
        }
        //valid courseDetails
        let course;
        try{
            course = await Course.findById(course_id);
            if(!course){
                return res.json({
                    success:false,
                    message:"Could not find the course",
                })
            }
            //user already pay for the same course
            const uid = new mongoose.Types.ObjectId(userId);
            if(course.studentsEnrolled.includes(uid)){
                return res.status(200).json({
                    success:true,
                    message:'Student is already enrolled'
                })
            }
        }
        catch(error){
            console.log(error);
            return res.status(500).json({
                success:false,
                message:error.message,
            })
        }
        
        //order create
        const amount = course.price;
        const currency = "INR";

        const options ={
            amount:amount *100,
            currency,
            receipt:Math.random(Date.now()).toString(),
            notes:{
                courseId:course_id,
                userId,
            }
        }
        try{
            //intitiate the payment using razorpay
            const paymentResponse = await instance.orders.create(options);
            console.log(paymentResponse); 
            return res.status(200).json({
                success:true,
                courseName:course.courseName,
                courseDescription:course.courseDescription,
                thumbnail:course.thumbnail,
                orderId:paymentResponse.id,
                currency:paymentResponse.currency,
                amount:paymentResponse.amount,
            })
        }
        catch(error){
            console.log(error);
            return res.json({
                success:false,
                message:"Could not initiate order",
            })
        }
        //return response
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}


//verify signature of Razorpay and Server

exports.verifySignature = async (req, res) =>{
    const webhookSecret = '12345678';

    const signature = req.headers["x-razorpay-signature"];

    const shasum = crypto.createHmac("sha256",webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if(signature === digest){
        console.log("Payment is Authorised");

        const {courseId, userId} = req.body.payload.payment.entity.notes;
        try{
            //fullfill the action

            //find the course and enrolll the student in it
            const enrolledCourse = await Course.findOneAndUpdate(
                {_id:courseId},
                {$push:{studentsEnrolled:userId}},
                {new:true},
            );
            if(!enrolledCourse){
                return res.status(500).jsonO({
                    success:false,
                    message:"Course not Found",
                });
            }
            console.log(enrolledCourse);

            //find the student and add the course to their enrolled  course men
            const enrolledStudent = await User.findOneAndUpdate(
                {_id:userId},
                {$push:{courses:courseId}},
                {new:true},
            )
            console.log(enrolledStudent);

            const emailResponse = await mailSender(
                enrolledStudent.email,
                "Congratulation to codehelp",
                "Congratulation , you are onboard into new codehelp course",

            );
            console.log(emailResponse);
            return res.status(200).json({
                success:true,
                message:"Signature verified and course added"
            });
        }
        catch(error){
            console.log(error);
            return res.status(500).json({
                success:false,
                message:error.message,
            })
        }

    }
    else{
        return res.status(400).json({
            success:false,
            message:"Invalid request",
        });
    }
}