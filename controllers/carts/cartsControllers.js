const productsdb = require("../../model/product/ProductModel");
const cartsdb = require("../../model/carts/cartsModel");

exports.AddtoCart = async (req, res) => {
  const { id } = req.params;

  try {
    const productfind = await productsdb.findOne({ _id: id });

    const carts = await cartsdb.findOne({
      userId: req.userId,
      productId: productfind._id,
    });

    if (productfind.quantity >= 1) {
      if (carts?.quantity >= 1) {
        carts.quantity = carts.quantity + 1;
        await carts.save();

        productfind.quantity = productfind.quantity - 1;
        await productfind.save();

        res
          .status(200)
          .json({ message: "Product Successfully Increment in your cart" });
      } else {
        const addtocart = new cartsdb({
          userId: req.userId,
          productId: productfind._id,
          quantity: 1,
        });

        await addtocart.save();

        productfind.quantity = productfind.quantity - 1;
        await productfind.save();

        res
          .status(200)
          .json({ message: "Product Successfully Added in your cart" });
      }
    } else {
      res.status(400).json({ error: "This Product is Sold Out" });
    }
  } catch (error) {
    res.status(400).json(error);
  }
};
