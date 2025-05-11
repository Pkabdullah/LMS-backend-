const mongoose = require("mongoose");
const { createTokenForUser } = require("../service/auth")
const { createHmac, randomBytes } = require("node:crypto");


const stdSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    rollNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        require: true
    },
    stdClassName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "stdclasses",
        required: true,
    },
    instituteName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admins",
        required: true,
    },
    role: {
        type: String,
        default: "student"
    },
    examResult: [
        {
            subName: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'subjects',
            },
            marksObtained: {
                type: Number,
                default: 0
            }
        }
    ],
    attendance: [{
        date: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ['Present', 'Absent'],
            required: true
        },
        subjectName: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "subjects",
            required: true,
        },
    }]

})

stdSchema.pre("save", function (next) {
    const student = this;
    if (!student.isModified("password")) return next();
    const salt = randomBytes(16).toString("hex");

    const hashedPassword = createHmac("sha256", salt)
        .update(student.password)
        .digest("hex");
    this.salt = salt;
    this.password = hashedPassword;
    next();
})
stdSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
    const student = await this.findOne({ email });

    if (!student) return false
    const salt = student.salt;
    const hashedpassword = student.password;
    const studentHashed = createHmac("sha256", salt)
        .update(password)
        .digest("hex");

    if (hashedpassword !== studentHashed)
        throw new Error(" InCorrect Password");

    const token = createTokenForUser(student)
    return token
})

const Student = mongoose.model("Student",stdSchema)
module.exports=Student


