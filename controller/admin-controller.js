const Admin = require("../model/adminSchema");
const multer = require("multer")
const path = require("path")

const AdminRegistration = async (req, res) => {
  try {
    const { name, email, instituteName, password, role} = req.body;
      const adminProfileImage = req.files['adminProfile']?.[0]?.filename;
    const instituteImage = req.files['instituteLogo']?.[0]?.filename;

    const existingAdmin = await Admin.findOne({ email });
    const existingInstitute = await Admin.findOne({ instituteName });

    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }
    if (existingInstitute) {
      return res.status(400).json({ message: "Institute already exists" });
    }

    const newAdmin = new Admin({
      name,
      email,
      instituteName,
      password,
      role,
      adminProfileImage,
      instituteImage

    });

    await newAdmin.save();
    newAdmin.password = undefined;
    
    res
      .status(201)
      .json({ message: "Admin registered successfully", admin: newAdmin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

  
};

const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,"./public/uploads")
  },
  filename:(req,file,cb)=>{
    cb(null,`${file.originalname}`)
  }
})
const fileFilter = (req,file,cb)=>{
  const allowedTypes= /jpeg|jpg|png/;
  const ext= path.extname(file.originalname).toLowerCase();
  if(allowedTypes.test(ext)){
    cb(null,true);
  }else{
    cb(new Error('Only Images are allowed'))
  }
}
const upload=multer({storage,fileFilter})

const AdminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ error: "Incorrect Username Or Password" });
    }

    const token = await Admin.matchPasswordAndGenerateToken(email, password);
    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Login successful",
        userId: admin._id,
        name: admin.name,
        email: admin.email,
        instituteName: admin.instituteName,
        adminProfile: admin.adminProfileImage,
        instituteLogo:admin.instituteImage
       
      });
  } catch (error) {
    res.status(500).json({ error: "Incorrect UserName Or Password" });
  }
};
const AdminLogout = async (req, res) => {
  return res.clearCookie("token").json({ message: "Logout successful" });
};

module.exports = { AdminRegistration, AdminLogin, AdminLogout ,upload};
