const express = require("express");
const router = new express.Router();

const adminAuthController = require("../../controllers/admin/adminControllers");
const adminuploads = require("../../multerconfig/admin/adminStorageConfig");
const adminauthenticate = require("../../middleware/admin/adminauthenticate");



router.post("/register", adminuploads.single("admin_profile"), adminAuthController.Register);
router.post("/login", adminAuthController.Login);
router.get("/adminverify", adminauthenticate, adminAuthController.AdminVerify);


module.exports = router;
