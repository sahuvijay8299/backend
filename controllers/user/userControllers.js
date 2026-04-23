const userDB = require("../../model/user/userModel");
const bcrypt = require("bcryptjs");
const cloudinary = require("../../Cloudinary/cloudinary");

exports.Register = async (req, res) => {
  console.log("user router /register api called");
  console.log("req body is => ", req.body);
  console.log("req file is => ", req.file);

  const { firstname, email, password, confirmpassword, lastname } = req.body;

  if (!firstname || !email || !password || !confirmpassword || !lastname) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const file = req.file?.path;
  const upload = await cloudinary.uploader.upload(file);
  console.log("upload file is=> ", upload);

  const hashPassword = await bcrypt.hash(password, 12);

  try {
    const preUser = await userDB.findOne({ email: email });
    if (preUser) {
      res.status(400).json({ error: "This user already exists !!" });
    } else if (password !== confirmpassword) {
      res
        .status(400)
        .json({ error: "password & confirm pasword dont match !!" });
    } else {
      const userData = new userDB({
        firstname,
        lastname,
        email,
        password: hashPassword,
        userprofile: upload.secure_url,
      });
      await userData.save();
      res.status(200).json(userData);
    }
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.Login = async (req, res) => {
  console.log("login api hitted successfully");
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "All fields are required" });
  }
  try {
    const userValid = await userDB.findOne({ email: email });
    console.log("User is=> ", userValid);

    if (userValid) {
      const isMatch = await bcrypt.compare(password, userValid.password);
      if (!isMatch) {
        res.status(400).json({ error: "Invalid credentials" });
      } else {
        const token = await userValid.generateAuthToken();
        const result = {
          token,
          userValid,
        };
        res.status(200).json(result);
      }
    } else {
      res.status(400).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.userVerify = async (req, res) => {
  try {
    const verifyUser = await userDB.findOne({ _id: req.userId });
    res.status(200).json(verifyUser);
    console.log("User verified success");
  } catch (error) {
    console.log("error in user verification=> ", error);
  }
};
exports.logout = async (req, res) => {
  try {
    req.rootUser.tokens = req.rootUser.tokens.filter((element) => {
      return element.token !== req.token;
    });
    await req.rootUser.save();
    res.status(200).json("Logout successful !!");
  } catch (error) {
    console.log("error in logout => ", error);
  }
};

// getAllUser

exports.getAllUser = async (req, res) => {
  const page = req.query.page || 1;
  const ITEM_PER_PAGE = 4;

  try {
    const skip = (page - 1) * ITEM_PER_PAGE;

    const count = await userDB.countDocuments();

    const pageCount = Math.ceil(count / ITEM_PER_PAGE);

    const usersdata = await userDB
      .find()
      .limit(ITEM_PER_PAGE)
      .skip(skip)
      .sort({ _id: -1 });

    res.status(200).json({
      Pagination: {
        count,
        pageCount,
      },
      usersdata,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

// userDelete

exports.userDelete = async (req, res) => {
  const { userid } = req.params;

  try {
    const deleteuser = await userDB.findByIdAndDelete({ _id: userid });
    res.status(200).json(deleteuser);
  } catch (error) {
    res.status(400).json(error);
  }
};
