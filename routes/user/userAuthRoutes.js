const express = require("express");
const router = new express.Router();

const userAuthController = require("./../../controllers/user/userControllers");
const userUpload = require("./../../multerconfig/user/userStorageConfig");
const userauthenticate = require("../../middleware/user/userauthenticate");
const adminauthenticate = require("../../middleware/admin/adminauthenticate");

router.post(
  "/register",
  userUpload.single("user_profile"),
  userAuthController.Register,
);

router.post("/login", userAuthController.Login);
router.get("/userverify", userauthenticate, userAuthController.userVerify);
router.get("/logout", userauthenticate, userAuthController.logout);

router.get("/getAlluser", adminauthenticate, userAuthController.getAllUser);
router.delete("/userDelete/:userid", adminauthenticate, userAuthController.userDelete);

module.exports = router;
