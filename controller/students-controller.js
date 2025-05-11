const Student = require("../model/studentSchema");

const StudentRegister = async (req, res) => {
  try {
    const {
      name,
      email,
      rollNumber,
      password,
      stdClassName,
      instituteName,
      role,
      examResult,
      attendance,
    } = req.body;
    const existingStudent = await Student.findOne({ email });
    const existingRollNumber = await Student.findOne({ rollNumber });
    if (existingStudent)
      return res.status(400).json({ message: "Student already exists" });
    if (existingRollNumber) {
      return res.status(400).json({ message: "RollNumber already exists" });
    }
    const student = await Student.create({
      name,
      email,
      rollNumber,
      password,
      stdClassName,
      instituteName,
      role,
      examResult,
      attendance,
    });
    await student.save();
    res
      .status(201)
      .json({ message: "Student registered successfully", student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStudent = async (req, res) => {
  const { instituteName } = req.params;
  try {
    const student = await Student.find({ instituteName: instituteName })
    if (!student) {
      return res.status(404).json({ message: "Students not found" })
    }
    res.status(200).json({ student })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { StudentRegister ,getStudent}