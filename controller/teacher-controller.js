const Teacher = require("../model/teacherSchema");

const TeacherRegister = async (req, res) => {
    try {
        const { name, email, password, teacherCode, role, instituteName, teacherClass, attendance } = req.body;
        const { subjectId } = req.params;

        const existingTeacher = await Teacher.findOne({ email });
        const existingTeacherCode = await Teacher.findOne({ teacherCode });
        if (existingTeacher) {
            return res.status(400).json({ message: "Teacher already exists" });
        }
        if (existingTeacherCode) {
            return res.status(400).json({ message: "Teacher code already exists" });
        }
        const teacher = await Teacher.create({
            name,
            email,
            password,
            teacherCode,
            role,
            instituteName,
            teacherClass,
            teachsubject: subjectId,
            attendance,
            teacherPassword: password,
        });

        await teacher.save();

        res.status(201).json({ message: "Teacher registered successfully", teacher });

    } catch (error) {

        res.status(500).json({ error: error.message });
    }
}

const getTeachers = async (req, res) => {
    const { instituteName } = req.params;
    try {

        const teachers = await Teacher.find({ instituteName: instituteName })
     
        if (!teachers) {
            return res.status(404).json({ message: "Teachers not found" })
        }
        res.status(200).json({ teachers })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const deleteTeacher = async (req,res)=>{
    const {teacherId} = req.params;
    try {
        const teacher =await Teacher.findByIdAndDelete(teacherId)
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }
        res.status(200).json({ message: "Teacher deleted successfully", deleteTeacher });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { TeacherRegister,getTeachers,deleteTeacher };

