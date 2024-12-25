import ProductModel from "../Models/Product.js";
import Cart from "../Models/Cart.js";
import User from "../Models/User.js";
import fs from "fs";
export const CreateProduct = async (req, res) => {
  try {
    let images = req?.files?.map((item) => {
      return item.filename;
    });
    const prdData = await ProductModel.create({
      name: req.body.name,
      description: req.body.description,
      qty: req.body.qty,
      price: req.body.price,
      images: images,
      department: req.body.departmentId,
    });
    if (prdData) res.status(201).send({ message: "Product Created!!!" });
    else res.status(404).send({ message: "Unable to create product!!" });
  } catch (error) {
    console.log("fail to submit data!!");
  }
};
export const UpdateProduct = async (req, res) => {
  try {
    // Check if product exists
    const existingprd = await ProductModel.findById(req.body.id);
    if (!existingprd) {
      return res.status(404).send({ message: "Product not found!!" });
    }

    // Delete old image if new image is uploaded
    if (req.file) {
      if (existingprd.images) {
        const oldImagePath = `uploadsPrd/${existingprd.images}`;
        // Check if old image file exists
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // Delete the old image
        }
      }
    }

    // Prepare updated data
    const updateData = {
      name: req.body.name,
      images: req.file ? req.file.filename : existingprd.images, // Use new image if uploaded
      description: req.body.description,
      qty: req.body.qty,
      price: req.body.price,
      department: req.body.departmentId,
    };

    // Update product in database
    const prdData = await ProductModel.findByIdAndUpdate(
      req.body.id, // Find product by ID
      updateData, // New data to update
      { new: true } // Return updated product
    );

    // Send response
    if (prdData) {
      res.status(200).send({ message: "Product Updated Successfully!!" });
    } else {
      res.status(400).send({ message: "Unable to Update Product!!" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ message: "Internal Server Error!!" });
  }
};
export const DeleteProduct = async (req, res) => {
  try {
    const existingprd = await ProductModel.findById(req.body.id);
    if (!existingprd) {
      return res.status(404).send({ message: "Product not Found!!" });
    }
    const prodata = await ProductModel.deleteOne({ _id: req.body.id });
    if (prodata.deletedCount > 0) {
      if (existingprd.images) {
        const imagePath = `uploadsPrd/${existingprd.images}`;
        try {
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log(" delete product  image");
          }
        } catch (error) {
          console.log("unable to delete image!!", error);
        }
      }
      res.status(200).send({
        message: "Product and image deleted successfully!!",
        DeleteProduct: existingprd,
      });
    } else {
      res.status(404).send({ message: "Unable to delete product!!!" });
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};
export const GetProductsByDepartmentId = async (req, res) => {
  try {
    const prdData = await ProductModel.find({
      department: req.query.departmentId,
    }).populate({ path: "department", populate: [{ path: "university" }] });
    res.status(200).send({ prdData });
  } catch (error) {
    console.log("fail to submit data!!");
  }
};
export const GetProductDetails = async (req, res) => {
  try {
    const prdData = await ProductModel.findOne({
      _id: req.query.id,
    }).populate({
      path: "department",
      populate: [{ path: "university" }],
    });
    res.status(200).send({ prdData });
  } catch (error) {
    console.log("Fail to submit data!!!");
  }
};
export const UpdateProductQty = async (req, res) => {
  try {
    let productInDb = await ProductModel.findOne({
      _id: req.body.id,
    });
    let active = true;
    if (productInDb.qty - req?.body.qty <= 0) active = false;
    let prdData = await ProductModel.findByIdAndUpdate(
      { _id: req.body.id },
      {
        qty: productInDb.qty - req.body.qty,
        active: active,
      }
    );
    if (prdData) res.status(200).send({ message: "Product qty updated!!!" });
    else res.status(404).send({ message: "Unable to Update product qty!!!" });
  } catch (error) {
    console.log("Fail to submit data!!!");
  }
};
export const AddToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        products: [
          {
            productId,
            quantity,
          },
        ],
      });
      await cart.save();
      return res.status(201).send({ message: "Product added to cart", cart });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    if (productIndex > -1) {
      // Increase the product quantity without affecting cart count
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({
        productId,
        quantity,
      });
    }

    await cart.save();
    res.status(200).send({ message: "Product added to cart", cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

//Cart View Api
export const GetCart = async (req, res) => {
  try {
    const { userId } = req.query;

    // Fetch the cart for the given userId, and populate product details
    const cart = await Cart.findOne({ userId }).populate("products.productId");

    if (!cart) {
      return res.status(200).send({
        message: "Cart is empty",
        cart: {
          products: [],
          totalItems: 0,
          totalQuantity: 0, // Total quantity of all products
        },
        count: 0, // Added count field for distinct product count
      });
    }

    // Calculate total distinct products in the cart
    const totalItems = cart.products.length;

    // Calculate the total quantity of all products in the cart
    const totalQuantity = cart.products.reduce(
      (sum, product) => sum + product.quantity,
      0
    );

    // Calculate distinct product count (for count field)
    const distinctProductCount = cart.products.length;

    res.status(200).send({
      message: "Cart fetched successfully",
      cart: {
        products: cart.products,
        totalItems: totalItems,
        totalQuantity: totalQuantity,
      },
      count: distinctProductCount, // Added distinct product count
    });
  } catch (error) {
    console.error("Error fetching cart details:", error);
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};
//Update quantity Api
export const UpdateQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).send({ message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).send({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    if (productIndex > -1) {
      cart.products[productIndex].quantity = quantity;
      await cart.save();
      res.status(200).send({ message: "Quantity updated", cart });
    } else {
      res.status(404).send({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error("Error updating quantity:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

//Delete Cart
export const DeleteProductItem = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).send({ message: "Cart not found" });
    }

    cart.products = cart.products.filter(
      (item) => item.productId.toString() !== productId.toString()
    );

    await cart.save();
    res.status(200).send({ message: "Product removed from cart", cart });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};
//Cheack out
export const Checkout = async (req, res) => {
  try {
    const { userId, productId } = req.body; // `productId` is an array of selected product IDs

    // Fetch the user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).send({ message: "Cart not found" });
    }

    // Filter out the selected products for checkout
    const purchasedProducts = cart.products.filter((product) =>
      productId.includes(product.productId.toString())
    );

    if (purchasedProducts.length === 0) {
      return res
        .status(400)
        .send({ message: "No products selected for checkout" });
    }

    // Remove the selected products from the cart
    cart.products = cart.products.filter(
      (product) => !productId.includes(product.productId.toString())
    );

    // Save the updated cart
    await cart.save();

    // Respond with the purchased products
    res.status(200).send({
      message: "Checkout successful",
      purchasedProducts,
    });
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { userId, productId } = req.body; // productId is an array of selected product IDs

    // *Step 1: Fetch the user's cart*
    const cart = await Cart.findOne({ userId }).populate("products.productId");
    if (!cart) {
      return res.status(404).send({ message: "Cart not found" });
    }

    // *Step 2: Filter selected products for checkout*
    const purchasedProducts = cart.products.filter((product) =>
      productId.includes(product.productId._id.toString())
    );

    if (purchasedProducts.length === 0) {
      return res
        .status(400)
        .send({ message: "No products selected for checkout" });
    }

    // *Step 3: Fetch user details*
    const user = await UserModel.findById(userId).populate([
      { path: "countryId" },
      { path: "stateId" },
      { path: "cityId" },
    ]);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // *Step 4: Create an OrderHeader*
    const totalAmount = purchasedProducts.reduce(
      (sum, item) => sum + item.quantity * item.productId.price,
      0
    );

    const orderHeader = await OrderHeader.create({
      userId,
      fullName: `${user.firstName} ${user.lastName}`,
      phoneNumber: user.phone,
      address: user.address,
      country: user.countryId,
      state: user.stateId,
      city: user.cityId,
      totalAmount,
    });

    // *Step 5: Create OrderDetails*
    const orderDetails = [];
    for (const item of purchasedProducts) {
      const detail = await OrderDetails.create({
        orderId: orderHeader._id,
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price,
        total: item.quantity * item.productId.price,
      });
      orderDetails.push(detail);
    }

    // *Step 6: Remove selected products from the cart*
    cart.products = cart.products.filter(
      (product) => !productId.includes(product.productId._id.toString())
    );
    await cart.save();

    // *Step 7: Respond with order summary and orderId*
    res.status(200).send({
      message: "Order created successfully",
      orderId: orderHeader._id, // Explicitly include orderId
      orderHeader,
      orderDetails,
    });
  } catch (error) {
    console.error("Error during order creation:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};
export const getProducts = async (req, res) => {
  try {
    const { productIds } = req.body; // Extract productIds from the request body

    if (!productIds || productIds.length === 0) {
      return res.status(400).send({ message: "No product IDs provided" });
    }

    // *Step 1: Fetch the Products*
    const products = await ProductModel.find({
      _id: { $in: productIds },
    });

    if (!products || products.length === 0) {
      return res.status(404).send({ message: "Products not found" });
    }

    // *Step 2: Respond with product details*
    res.status(200).send({
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.error("Error during fetching products:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};