const mongoose = require("mongoose");
const { createTokenForUser} = require("../service/auth")
const { createHmac, randomBytes } = require("node:crypto");
const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  role: { type: String, default: "admin" },
  instituteName: { type: String, required: true, unique: true },
  adminProfileImage: {
    type: String,
    default: "/adminProfile.jpeg",
  },
  instituteImage: {
    type: String,
    default: "/adminicon.png",
  },
  salt: {
    type: String,
  },
},{timestamps:true});

adminSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return;
  const salt = randomBytes(16).toString();
  const hashedPassowrd = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");
  this.salt = salt;
  this.password = hashedPassowrd;
  next();
});
adminSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
  const user = await this.findOne({ email });
 
  if (!user) return false
  const salt = user.salt;
  const hashedpassword = user.password;
  const userHashed = createHmac("sha256", salt)
  .update(password)
  .digest("hex");

    if (hashedpassword !== userHashed) 
        throw new Error("InCorrect Password");
   
    const token= createTokenForUser(user)
    return token
});
const Admin = mongoose.model("admin", adminSchema);
module.exports = Admin;
