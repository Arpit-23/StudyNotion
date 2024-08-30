const Category = require("../models/Category");


function getRandomInt (max) {
    return Math.floor(Math.random * max);
}

exports.createCategory = async (req, res) =>{
    try{
        //fetch data
        const {name , description} = req.body;
        //validation
        if(!name||!description){
            res.status(400).json({
                success:false,
                message:'Please fill all the field entry'
            })
        }
        //DB entry
        const categoryDetails = await Category.create({
            name:name,
            description:description,
        });
        console.log(categoryDetails);
        //send response
        return res.status(200).json({
            success:true,
            message:"Category created successfully",
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

//get all category handler
exports.showAllCategory = async (req, res) =>{
    console.log("Inside show all category");
    try{

        const allCategory = await Category.find({});
        console.log(allCategory)
        res.status(200).json({
            success:true,
            message:"All  Categorys return successfully",
            data:allCategory,
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

//categorypageDetails
exports.categoryPageDetails = async (req, res) =>{
    try{
        //get category id
        const {categoryId} = req.body;
        //get course for specified categoryid
        const selectedCategory = await Category.findById(categoryId)
        .populate({
          path: "courses",
          match: { status: "Published" },
          populate: "ratingAndReviews",
        })
        .exec()
        //validation
        if(!selectedCategory){
            return res.status(404).json({
                success:false,
                message:"Data Not Found",
            })
        }

        //No course in this category
        if(selectedCategory.courses.length === 0){
            console.log("No course found for the selected category.");
            return res.status(404).json({
                success:false,
                message:"No course foound fro the selected category.",
            })
        }

        //get course for different categories
        const categoriesExceptSelected = Category.find({
            _id:{$ne:categoryId},
        })
        const differentCategory = await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]._id
        )
        .populate({
            path:"courses",
            match:{status:"Published"},
        })
        .exec();

        //get top 10 selling courses across all category
        const allCategories = await Category.find()
        .populate({
            path:"courses",
            match:{status:"Published"},
            populate:{
                path:"instructor",
            }
        })
        .exec();

        const allCourses = allCategories.flatMap((category) =>category.courses);
        const mostSellingCourses = allCourses.sort((a,b) =>b.sold - a.sold).slice(0,10);

        //return res
        return res.status(200).json({
            success:true,
            data:{
                selectedCategory,
                differentCategory,
                mostSellingCourses,
            }
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