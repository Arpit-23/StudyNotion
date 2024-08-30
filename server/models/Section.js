const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
    sectionName: {
        type:String,
    },
    subSection: [
        {
            type:mongoose.Schema.Types.ObjectId,
            require:true,
            ref:"SubSection",
        }
    ],
    // description: {
    //     type:String,
    //     trim:true,
    // },
    // videoUrl: {
    //     type:Number,
    //     trim:true,
    // },
    
});

module.exports = mongoose.model("Section",sectionSchema);