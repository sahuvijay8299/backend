const categorydb = require("../../model/product/productCategoryModel");
const cloudinary = require("../../Cloudinary/cloudinary");
const productsdb = require("../../model/product/ProductModel");

// AddCategory
exports.AddCategory = async (req, res) => {
  const { categoryname, description } = req.body;

  if (!categoryname || !description) {
    return res.status(400).json({ error: "Fill All Details" });
  }

  try {
    const existingcategory = await categorydb.findOne({
      categoryname: categoryname,
    });

    if (existingcategory) {
      res.status(400).json({ error: "This Category Already Exist" });
    } else {
      const addCategory = new categorydb({
        categoryname,
        description,
      });

      await addCategory.save();
      res.status(200).json(addCategory);
    }
  } catch (error) {
    res.status(400).json(error);
  }
};

// GetCategory
exports.GetCategory = async (req, res) => {
  try {
    const getallcategory = await categorydb.find({});
    res.status(200).json(getallcategory);
  } catch (error) {
    res.status(400).json(error);
  }
};

// AddProducts
exports.AddProducts = async (req, res) => {
  const { productname, price, discount, quantity, description, categoryId } =
    req.body;
 
  if (
    !productname ||
    !price ||
    !discount ||
    !quantity ||
    !description ||
    !req.file
  ) {
    return res.status(400).json({ error: "All Filed required" });
  }

  try {
    const upload = await cloudinary.uploader.upload(req.file.path);

    const existingProduct = await productsdb.findOne({
      productname: productname,
    });

    if (existingProduct) {
      res.status(400).json({ error: "This Product Already Exist" });
    } else {
      const addProduct = new productsdb({
        productname,
        price,
        discount,
        quantity,
        description,
        categoryid: categoryId,
        productimage: upload.secure_url,
      });

      await addProduct.save();
      res.status(200).json(addProduct);
    }
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.getAllProducts = async (req, res) => {
  
  const categoryid = req.query.categoryid || "";
  const page = req.query.page || 1;
  const ITEM_PER_PAGE = 8;
  // const ITEM_PER_PAGE = 4;

  console.log("page", page);
  console.log("categoryid", categoryid);

  const query = {};

  if (categoryid !== "all" && categoryid) {
    query.categoryid = categoryid;
  }

  try {
    const skip = (page - 1) * ITEM_PER_PAGE; 

    const count = await productsdb.countDocuments(query);

    const getAllProducts = await productsdb
      .find(query)
      .limit(ITEM_PER_PAGE)
      .skip(skip);

    const pageCount = Math.ceil(count / ITEM_PER_PAGE); 

    res.status(200).json({
      getAllProducts,
      Pagination: {
        totalProducts: count,
        pageCount,
      },
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

//getsingleproduct

exports.getSingleProduct = async (req, res) => {
  const { productid } = req.params;

  try {
    const getSingleProductdata = await productsdb.findOne({ _id: productid });

    res.status(200).json(getSingleProductdata); // ✅ correct
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//getlatesteproducts
exports.getLatestproducts = async(req,res)=>{
  try {
    const getNewProducts = await productsdb.find().sort({ _id: -1 });
    res.status(200).json(getNewProducts)
  } catch (error) {
    res.status(400).json(error);
  }
  
  
}

//Deleteproducts
  exports.DeleteProducts = async (req, res) => {
    const { productid } = req.params;
    try {
      const DeleteProducts = await productsdb.findByIdAndDelete({ _id: productid });
      res.status(200).json(DeleteProducts);
    } catch (error) {
      res.status(400).json(error);
    }
  
  }