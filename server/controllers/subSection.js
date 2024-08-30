const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
const { data } = require("autoprefixer");

exports.createSubSection = async (req,res) =>{
    try{
        //fetch data
        // console.log("first")
        const {sectionId, title, description} =req.body;
        //extract file/video
        // console.log("second")
        const video = req.files.video;
        console.log("second",sectionId, title, description,video);
        //validation
        if(!sectionId|| !title ||!description ||!video){
            res.status(400).json({
                success:false,
                message:"All fields are required",
            })
        }
        //upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        //create subsection
        // console.log("third")
        const subSectionDetails = await SubSection.create({
            title:title,
            timeDuration:`${uploadDetails.duration}`,
            description:description,
            videoUrl:uploadDetails.secure_url
        })
        // console.log("fourth")
        //update section with this subsection objectId
        const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},{
            $push:{
                subSection:subSectionDetails._id
            }
        },
        {new:true}
    ).populate("subSection");
    // console.log("fifth")
    //HW log updated section here after adding populate query
        //return response;
        return res.status(200).json({
            success:true,
            message:"Subsection create successfully",
            data:updatedSection,
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to create subSection ,please try again",
            error:error.message,
        });
    }
}

//HW update and delete subsection
exports.updateSubSection = async (req, res) =>{
    try{
        //data fetch
        const {subSectionId, title, sectionId, description} =req.body;
        //update data
        const subSection = await SubSection.findById(subSectionId);

        if (!subSection) {
            return res.status(404).json({
            success: false,
              message: "SubSection not found",
            })
        }
                                                      
        if (title !== undefined) {
            subSection.title = title
        }
                                                      
        if (description !== undefined) {
            subSection.description = description
       }  
       
       if (req.files && req.files.video !== undefined) {
        const video = req.files.video
        const uploadDetails = await uploadImageToCloudinary(
          video,
          process.env.FOLDER_NAME
        )
        subSection.videoUrl = uploadDetails.secure_url
        subSection.timeDuration = `${uploadDetails.duration}`
      }
  
      await subSection.save()
  
      // find updated section and return it
      const updatedSection = await Section.findById(sectionId).populate(
        "subSection"
      )
        //return response
        return res.status(200).json({
            success:true,
            message:"SubSection updated successfully",
            data:updatedSection,
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to update Subsection ,please try again",
            error:error.message,
        });
    }
}
exports.deleteSubSection = async (req, res) =>{
    try{
        //get Id 
        const {subSectionId,sectionId} =req.body;
        //findbyidanddelete
        await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
              $pull: {
                subSection: subSectionId,
              },
            }
          )
        const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId });

        if (!subSection) {
            return res
              .status(404)
              .json({ success: false, message: "SubSection not found" })
          }
      
          // find updated section and return it
          const updatedSection = await Section.findById(sectionId).populate(
            "subSection"
          );

        return res.status(200).json({
            success:true,
            message:"SubSection deleted successfully",
            data: updatedSection,
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to delete SubSection ,please try again",
            error:error.message,
        });
    }
}