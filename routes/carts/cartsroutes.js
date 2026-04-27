const express = require("express");
const router = new express.Router();


const cartsControllers = require("../../controllers/carts/cartsControllers");
const userauthenticate = require("../../middleware/user/userauthenticate");

router.post("/addtocart/:id", userauthenticate, cartsControllers.AddtoCart);


module.exports = router; 