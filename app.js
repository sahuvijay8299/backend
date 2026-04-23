const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
require("./db/conn");
const cors = require("cors");

const app = express();
     
const port = 4009;

app.use(cors());
app.use(express.json());
const adminAuthRoutes = require("./routes/admin/adminAuthRoutes");
app.use("/adminauth/api", adminAuthRoutes);

const productroutes = require("./routes/products/productroutes");
app.use("/product/api", productroutes);


const userAuthRoutes = require("./routes/user/userAuthRoutes");
app.use("/userauth/api", userAuthRoutes);



app.get("/", (req, res) => {
  res.status(200).json("server started");
});
app.listen(port, () => {
  console.log(`server started on port no ${port}`);
});
