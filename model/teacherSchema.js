const mongoose = require("mongoose");
const { createTokenForUser} = require("../service/auth")

const { createHmac, randomBytes } = require("node:crypto");
const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    teacherCode:{
        type: String,
        required: true,
        unique: true,
    },
    role:{
        type: String,
       default: "teacher",
    },
    password:{
        type: String,
        required: true,
    },
    instituteName:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"admins",
        required:true,
    },
    teachsubject:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"subjects",
        required:true,
    },
    teacherClass:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"stdclasses",
        required:true,
    },
    salt: {
        type: String,
      },
    attendance: [{
        date: {
            type: Date,
            required: true
        },
        presentCount: {
            type: String,
        },
        absentCount: {
            type: String,
        }
    }]
}, { timestamps: true });

teacherSchema.pre("save", function (next) {
    const teacher = this;
    if (!teacher.isModified("password")) return next();
    const salt = randomBytes(16).toString("hex");

    const hashedPassword = createHmac("sha256", salt)
      .update(teacher.password)
      .digest("hex");
    this.salt = salt;
    this.password = hashedPassword;
    next();
  });
  teacherSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
    const teacher = await this.findOne({ email });
   
    if (!teacher) return false
    const salt = teacher.salt;
    const hashedpassword = teacher.password;
    const teacherHashed = createHmac("sha256", salt)
    .update(password)
    .digest("hex");
  
      if (hashedpassword !== teacherHashed) 
          throw new Error(" InCorrect Password");
     
      const token= createTokenForUser(teacher)
      return token
  });

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;