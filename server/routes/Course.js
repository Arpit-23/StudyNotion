const express = require("express");
const router = express.Router();

//Import All Controllers related to the course

//Course controller
const {
    createCourse,
    getAllCourses,
    getCourseDetails,
    getFullCourseDetails,
    editCourseDetails,
    getInstructorCourses,
    deleteCourse,
} = require("../controllers/Course");

//categories controllers
const {
    showAllCategory,
    createCategory,
    categoryPageDetails,
} = require("../controllers/Category")

//Section controllers
const {
    createSection,
    updateSection,
    deleteSection,
} = require("../controllers/Section")

//Sub-section controllers
const {
    createSubSection,
    updateSubSection,
    deleteSubSection,
} = require("../controllers/subSection");

//Rating controllers
const {
    createRating,
    getAverageRating,
    getAllRating,
} = require("../controllers/RatingAndReview");

// const {
//     updateCourseProgress
// } = require("../controllers/courseProgress");


//import middleware
const { auth ,isInstructor, isStudent, isAdmin } = require("../middlewares/auth");



                            //Course Router
//course only created by intructor
router.post("/createCourse", auth , isInstructor, createCourse);

router.get("/getAllCourses", getAllCourses);

router.post("/getCourseDetails", getCourseDetails);

router.post("/getFullCourseDetails", auth , getFullCourseDetails);

router.post("/editCourse", auth , isInstructor, editCourseDetails);

router.get("/getInstructorCourses", auth , isInstructor, getInstructorCourses);

router.delete("/deleteCourse", deleteCourse);

// router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);


router.post("/addSection", auth , isInstructor, createSection);

router.post("/updateSection", auth , isInstructor, updateSection);

router.post("/deleteSection", auth , isInstructor, deleteSection);

router.post("/updateSubSection", auth , isInstructor, updateSubSection);

router.post("/deleteSubSection", auth , isInstructor, deleteSubSection);

router.post("/addSubSection", auth , isInstructor, createSubSection);



                        //CATEGORY ROUTES(ONLY BY ADMIN)

router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories",showAllCategory);
router.post("/getCategoryPageDetails", categoryPageDetails);




                    //RATING AND REVIEW 

router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRating);


module.exports = router;