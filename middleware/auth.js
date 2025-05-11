const { validateToken } = require("../service/auth");

function checkForAuthenticationCookies(cookieName) {
    return (req, res, next) => {
      const tokenCookieValue = req.cookies[cookieName];
      const userId = req.headers["authorization"];
      // console.log(userId)
      if (!tokenCookieValue) {
      return  next();
      }
      try {
        const userPayload = validateToken(tokenCookieValue);
       
        req.user = userPayload;
      } catch (error) {}
     return next();
    };
  }
function restrictTo(roles = []) {
    return function (req, res, next) {
    
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" }); 
      }
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: "Forbidden" }); 
      }
      next();
    };
  }
  
  module.exports = {restrictTo,checkForAuthenticationCookies}