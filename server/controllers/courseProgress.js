const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress");

exports.updateCourseProgress = async (req, res) => {
  const { courseId, subSectionId } = req.body;
  const userId = req.user.id;

  try {
    //check if subsection is valid
    const subsection = await SubSection.findById(subSectionId);
    if (!subsection) {
      return res.status(404).json({ error: "Invalid subsection" });
    }

    //find courseprogress of a student
    let courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    });

    if (!courseProgress) {
      return res.status(404).json({
        success: false,
        message: "Course progress does not exits",
      });
    } else {
      //check for subsection is already completed to watch
      if (courseProgress.completedVideos.includes(subSectionId)) {
        return res.status(400).json({ error: "SubSection already completed" });
      }

      courseProgress.completedVideos.push(subSectionId);

      await courseProgress.save();

      return res.status(200).json({
        message: "Course progress updated",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
