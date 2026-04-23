const express = require("express");
const router = new express.Router();

const adminauthenticate = require("../../middleware/admin/adminauthenticate");
const productController = require("../../controllers/product/productController");
const productupload = require("../../multerconfig/products/productStorageConfig");


router.post("/addcategory", adminauthenticate, productController.AddCategory);
router.get("/getcategory", productController.GetCategory);

router.post( "/addproducts",adminauthenticate,productupload.single("productimage"), productController.AddProducts,
);

router.get("/getProducts", productController.getAllProducts);

router.get("/getSingleProduct/:productid", productController.getSingleProduct);

router.delete("/deleteproduct/:productid", adminauthenticate, productController.DeleteProducts,);

router.get("/getLatestProducts", productController.getLatestproducts);




module.exports = router;
