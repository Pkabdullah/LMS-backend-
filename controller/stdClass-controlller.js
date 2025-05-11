const StdClasses = require("../model/stdClasses");
const Subject = require("../model/subjectSchema");

const addStdClass=async(req,res)=>{
    try {
        const{className,instituteName}=req.body;
        const existingClass =await StdClasses.findOne({className,instituteName});
        if(existingClass){
            return res.status(400).json({message:"Class already exists"});
        }
        const newClass = new StdClasses({className,instituteName});
        await newClass.save();
        res.status(201).json({message:"Class added successfully",newClass});

    } catch (error) {
        res.status(500).json({message:"Internal server error"});
    }
}

module.exports = {addStdClass};

const getAllStdClasses=async(req,res)=>{
    try {
        const { userId } = req.params; 
        const classes = await StdClasses.find({ instituteName: userId });
        if (classes.length === 0) {
            return res.status(404).json({ message: 'No classes found for this user' });
          }
        res.status(200).json({classes});
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
    }
}

// const deleteStdClass=async(req,res)=>{
//     try {
//         const {classId}=req.params;
//         const deletedClass=await StdClasses.findByIdAndDelete(classId);
//         if(!deletedClass){
//             return res.status(404).json({message:"Class not found"});
//         }
//         res.status(200).json({message:"Class deleted successfully",deletedClass});
//     } catch (error) {
//         res.status(500).json({message:"Internal server error"});
//     }
// }
const deleteStdClass = async (req, res) => {
    try {
      const { classId } = req.params;
  
      // Delete the class
      const deletedClass = await StdClasses.findByIdAndDelete(classId);
      if (!deletedClass) {
        return res.status(404).json({ message: "Class not found" });
      }
  
    //  Delete related subjects
      await Subject.deleteMany({ subjectClass: classId });
  
      // Delete related teachers
    //   await Teacher.deleteMany({ teacherClass: classId });
  
      res.status(200).json({ 
        message: "Class, related subjects, and teachers deleted successfully", 
        deletedClass 
      });
    } catch (error) {
      console.error("Error deleting class and related data:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
module.exports = {addStdClass,getAllStdClasses,deleteStdClass};
