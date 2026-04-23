const adminDB = require("../../model/admin/adminModel");
const cloudinary = require("../../Cloudinary/cloudinary");
const bcrypt = require("bcrypt");
exports.Register = async (req, res) => {
  console.log("admin route called\n register api called");
  console.log("req body is =>", req.body);
  console.log("req file is =>", req.file);

  const { name, email, password, mobile, confirmpassword } = req.body;
  console.log("name is", name);
  console.log("email is", email);
  console.log("mobile is", mobile);
  console.log("password is", password);

  if (!name || !email || !password || !mobile || !confirmpassword) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const file = req.file?.path;
  const upload = await cloudinary.uploader.upload(file);

  console.log("file path is", file);
  console.log("upload url is", upload);

  try {
    const preuser = await adminDB.findOne({ email: email });
    const mobileverification = await adminDB.findOne({ mobile: mobile });
    const hasspassword = await bcrypt.hash(password, 10);

    if (preuser) res.status(400).json({ error: "This Admin is Already Exist" });
    else if (mobileverification)
      res.status(400).json({ error: "This Mobile is Already Exist" });
    else if (password !== confirmpassword)
      res
        .status(400)
        .json({ error: "password and confirm password not match" });
    else {
      const adminData = new adminDB({
        name,
        email,
        mobile,
        password: hasspassword,
        profile: upload.secure_url,
      });

      // console.log("admindata", adminData)

      await adminData.save();
      res.status(200).json(adminData);
    }
  } catch (error) {
    res.status(400).json(error);
  }

  res.send("register api called");
};

// controllers > admin > adminControllers.js

exports.Login = async (req, res) => {
  console.log("login api hitted or requested");
  const { email, password } = req.body;
  console.log("request body is", req.body);

  if (!email || !password) {
    return res.status(400).json({ error: "all field required" });
  }

  try {
    const adminValid = await adminDB.findOne({ email: email });
    console.log("admin db", adminValid);

    if (adminValid) {
      const isMatch = await bcrypt.compare(password, adminValid.password);

      if (!isMatch) {
        return res.status(400).json({ error: "invalid credentials" });
      }

      const token = await adminValid.generatAuthtoken();
      const result = {
        adminValid,
        token,
      };

      res.status(200).json({ result });
    } else {
      res.status(400).json({ error: "invalid details" });
    }
  } catch (error) {
    res.status(400).json(error);
  }
};


exports.AdminVerify = async (req, res) => {
  console.log("request root user is", req.rootUser);

  const VerifyAdmin = await adminDB.findOne({ _id: req.userId });
  res.status(200).json(VerifyAdmin);
};