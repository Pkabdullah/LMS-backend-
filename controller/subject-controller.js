const Subject = require("../model/subjectSchema");

const addSubject = async (req, res) => {
    const { subjectName, subjectCode, subjectSession, subjectClass, instituteName } = req.body;
    const existingSubject = await Subject.findOne({ subjectName, subjectCode, subjectClass, instituteName });
    if (existingSubject) {
        return res.status(400).json({ message: "Subject already exists" });
    }
    try {
        const subject = await Subject.create({ subjectName, subjectCode, subjectSession, subjectClass, instituteName });
        res.status(201).json({ message: "Subject added successfully", subject });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}


const getAllSubjects = async (req, res) => {
    const { userId } = req.params; 
    try {
        const subject = await Subject.find({ instituteName: userId });

        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        res.status(200).json({ subject });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const getAllSubjectsByClass = async (req, res) => {
    const { userId, subjectClass } = req.params; 
    try {
        const subjectClassWise = await Subject.find({ instituteName: userId, subjectClass });

        if (subjectClassWise.length === 0) {
            return res.status(404).json({ message: "Subjects not found" });
          }

        res.status(200).json({ subjectClassWise });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}
const deleteSubject = async (req, res) => {
    try {
        const { subjectId } = req.params;
        const deletedSubject = await Subject.findByIdAndDelete(subjectId);
        if (!deletedSubject) {
            return res.status(404).json({ message: "Subject not found" });
        }
        res.status(200).json({ message: "Subject deleted successfully", deletedSubject });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}


module.exports = { addSubject, getAllSubjects, deleteSubject,getAllSubjectsByClass };



