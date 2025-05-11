const express = require("express");
const router = express.Router();

const {
  AdminRegistration,
  AdminLogin,
  AdminLogout,
  upload,
} = require("../controller/admin-controller");
const { addStdClass ,getAllStdClasses, deleteStdClass} = require("../controller/stdClass-controlller");
const { restrictTo } = require("../middleware/auth");

const { addSubject, getAllSubjects, deleteSubject, getAllSubjectsByClass } = require("../controller/subject-controller");
const { TeacherRegister, getTeachers, deleteTeacher } = require("../controller/teacher-controller");
const { sendEmail } = require("../controller/nodemailer-controller");
const { StudentRegister, getStudent } = require("../controller/students-controller");

//Admin Routes
router.post(
  "/AdminRegisteration",
  upload.fields([
    { name: "adminProfile", maxCount: 1 },
    { name: "instituteLogo", maxCount: 1 },
  ]),
  AdminRegistration
);

router.post("/Login", AdminLogin);
router.delete("/AdminLogout", AdminLogout);

//Class Routes

router.post("/addStdClass", addStdClass);
router.get("/getAllStdClasses/:userId", getAllStdClasses);
router.delete("/deleteStdClass/:classId", deleteStdClass);


//Subject Routes

router.post("/addSubject", addSubject);
router.get("/getAllSubjects/:userId", getAllSubjects);
router.get("/getAllSubjectsByClass/:userId/:subjectClass", getAllSubjectsByClass);
router.delete("/deleteSubject/:subjectId", deleteSubject);
module.exports = router;

// Teachers Route

router.post("/teacherRegister/:subjectId", TeacherRegister);
router.get("/getTeachers/:instituteName", getTeachers);
router.delete("/deleteTeacher/:teacherId",deleteTeacher)
//Teacher Mail Route
router.post("/send-email",sendEmail)

//Student Route
router.post("/register-student",StudentRegister)
router.get("/getStudent/:instituteName",getStudent)

