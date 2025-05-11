const mongoose = require("mongoose");

const stdClassesSchema = new mongoose.Schema({
    className:{
        type: String,
        required: true,
    },
    instituteName:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"admins",
        required:true,
    },
    
 
} ,{ timestamps: true });
const StdClasses = mongoose.model("StdClasses", stdClassesSchema);
module.exports = StdClasses;
