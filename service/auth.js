const JWT = require("jsonwebtoken");
const secret = process.env.JWT_SECRET


function createTokenForUser(user){
    const payload={
        _id : user._id,
        email:user.email,
        role:user.role,
        schoolName:user.schoolName
    }
console.log("payload",payload)

    const token = JWT.sign(payload,secret,{ expiresIn: "1h" })
   
    return token;
}
function validateToken(token){
    const payload =JWT.verify(token,secret)
    return payload;

}
module.exports = {createTokenForUser,validateToken}