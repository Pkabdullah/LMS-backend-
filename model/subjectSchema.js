const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
    subjectName:{
        type:String,
        required:true,
    },
    subjectCode:{
        type:String,
        required:true,
    },
    subjectSession:{
        type:Number,
        required:true,
    },
    subjectClass:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"stdclasses",
        required:true,
    },
    instituteName:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"admins",
        required:true,
    },
    // subjectTeacher:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:"Teacher",
    // }
})
const Subject = mongoose.model("Subject", subjectSchema);
module.exports = Subject;

