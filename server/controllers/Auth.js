const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const {passwordUpdated} = require("../mail/templates/passwordUpdate");
const Profile = require("../models/Profile")
require("dotenv").config();

//sendOTP
exports.sentOTP = async (req, res) =>{

    try{
        //fetch email from request body
        const {email} = req.body;

        //check if user already exist
        const checkUserPresent = await User.findOne({email});

        //if user already exists, then return a respons
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:'User already registered',
            })
        }

        //generate otp
        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        console.log("OTP generated: ",otp);

        //check unique otp or not
        let result = await OTP.findOne({otp:otp});

        while(result){
            otp = otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
        })
        result = await OTP.findOne({otp:otp});
    }
    

    const otpPayload = {email, otp};
    //create an entry for otp
    const otpBody = await OTP.create(otpPayload);

    //return resposse successfuly
    return res.status(200).json({
        success:true,
        message:'OTP sent Successfully',
        otp,
    })
    
}

catch(error){
    console.log(error);
    res.status(500).json({
        success:false,
        message:error.message,
    })
}
}

//signup
exports.signUp = async (req, res)=>{

    try{
        //data fetch from request ki body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            otp,
        } = req.body;
        //validate karlo
        if(!firstName||!lastName||!email||!password||!confirmPassword||!otp){
            return res.status(403).json({
                success:false,
                message:"All fields are required",
            })
        }

        //2 password match karlo
        if(password!== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and ConfirmPassword Value does not match, please try again",
            })
        }

        //check user already exist or not
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User is already registered",
            })
        }

        //find most recent otp stored for the user
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        //otp not found
        if(recentOtp.length===0){
            return res.status(400).json({
                success:false,
                message:"OTP not found",
            });
        }
        else if(otp !== recentOtp[0].otp){
            //Invalid OTP
            return res.status(400).json({
                success:false,
                message:"Invalid OTP",
            });
        }
        //hash password
        const hashedPassword = await bcrypt.hash(password , 10);

        //entry create in DB
        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
        })


        const user = await User.create({
            firstName,
            lastName,
            email,
            password:hashedPassword,
            accountType,
            additionalDetails:profileDetails,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        })


        //return res
        return res.status(200).json({
            success:true,
            message:"user is registered successfully",
            user,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'User can not be registered. Please try again',
        })
    }
}

//login
exports.login = async (req, res) =>{
    try{
        //get data from req ki body
        const {email, password} = req.body;
        //validate data
        if(!email||!password){
            return res.status(403).json({
                success:false,
                message:"All fields are required , please try again",
            });
        }
        //user check exist or not
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            console.log("User is not registered, please sign up")
            return res.status(401).json({
                success:false,
                message:"User is not registered, please sign up",
            })
        }
        //generate JWT, after password matching
        if(await bcrypt.compare(password, user.password)){
            const payload ={
                email :user.email,
                id: user._id,
                accountType:user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET,{
                expiresIn:"24h",
            });
            user.token = token;
            user.password = undefined;

             //create cookies and send resposnse
             const options ={
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,
             }
             res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user,
                message:"Logged in successfully",
             })
        }
        else{
            
            return res.status(401).json({
                success:false,
                message:'Password in incorrect'
            })
        }
       
       
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Login failure, please try again'
        })
    }
}



//changePassword
exports.changePassword = async (req, res) =>{
    try{
        //get data form req body
        const userDetails = await User.findById(req.user.id);
        //get oldPassword ,newPassword, confirmPassword
        const {oldPassword ,newPassword} = req.body;
        //validation
        const isPasswordMatch =await bcrypt.compare(oldPassword,userDetails.password);
        if(!isPasswordMatch){
            return res.status(401).json({
                success:false,
                message:"The password is incorrect",
            })
        }
        //update pwd in DB
        const encryptedPassword = await bcrypt.hash(newPassword,10);
        const updateUserDetails = await User.findByIdAndUpdate(req.user.id,{password:encryptedPassword},{new:true});
        //send mail -Password updated
        try{
            const emailResponse = await mailSender(
                updateUserDetails.email,
                "Password for your account has been updated",
                passwordUpdated(updateUserDetails.email,`Password updated successfully for ${updateUserDetails.firstName} ${updateUserDetails.lastName}`)
            );
        }
        catch(error){
            console.log("Error occured while sending email: ",error);
            return res.status(501).json({
                success:false,
                message:"Error occurred while sending email",
                error:error.message,
            })
        }
        return res.status(200).json({
            success:true,
            message:"Password updated successfully"
        })
    }
    catch(error){
        console.log("Error occured while updated password: ",error);
            return res.status(500).json({
                success:false,
                message:"Error occurred while updating password",
                error:error.message,
            })
    }
}