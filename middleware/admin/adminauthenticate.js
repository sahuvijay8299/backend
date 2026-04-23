const jwt = require("jsonwebtoken");
const adminDB = require("../../model/admin/adminModel");
const SECRET_KEY = process.env.ADMIN_SECRET_KEY || "SECRET_KEY";

const adminauthenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    console.log("token from authorization is", token);
    console.log("1st line");

    const verifyToken = await jwt.verify(token, SECRET_KEY);
    console.log("verify token is", verifyToken);
    console.log("2nd line");

    const rootUser = await adminDB.findOne({ _id: verifyToken._id });
    // console.log("root user is", rootUser)
    console.log("3rd line");

    if (!rootUser) {
      throw new Error("user not found");
    }
    console.log("4th line");

    req.token = token;
    req.rootUser = rootUser;
    req.userId = rootUser._id;

    next();
  } catch (error) {
    // console.log("error line");
    // res.status(400).json({ error: "Unauthorized No token Provide" });
    res.status(400).json({ error: error.message });
  }
};

module.exports = adminauthenticate;
