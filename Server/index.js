import mongoose from "mongoose";
import cors from "cors";
import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import Location from "./Controller/Location.js";
import User from "./Controller/User.js";
import {
  DeleteProductItem,
  Checkout,
  AddToCart,
  GetCart,
  UpdateQuantity,
  createOrder,
  getProducts,
} from "./Controller/Product.js";
import {
  CreateUniversity,
  DeleteUniversity,
  GetUniversity,
  UpdateUniversity,
} from "./Controller/University.js";
import {
  CreateDepartment,
  DeleteDepartment,
  GetDepartmentByUniversityId,
  UpdateDepartment,
} from "./Controller/Department.js";
import {
  CreateProduct,
  DeleteProduct,
  GetProductDetails,
  GetProductsByDepartmentId,
  UpdateProduct,
  UpdateProductQty,
} from "./Controller/Product.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
//Image Access
app.use(express.static("uploadUniv/"));
app.use(express.static("uploadDep/"));
app.use(express.static("uploadsPrd/"));

//university Model
const storageUniv = multer.diskStorage({
  destination: "uploadUniv/",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extention = file.originalname.split(".").pop();
    cb(null, `university-${uniqueSuffix}.${extention}`);
  },
});
const uploadsUniv = multer({
  storage: storageUniv,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only Image Files Are Allowed"), false);
    }
  },
});
//http://localhost:8081/university
app.post("/university", uploadsUniv.single("image"), CreateUniversity);
app.put("/university", uploadsUniv.single("image"), UpdateUniversity);
app.delete("/university", DeleteUniversity);
app.get("/university", GetUniversity);
//Department Modle
const storageDep = multer.diskStorage({
  destination: "uploadDep/",
  filename: (req, file, cb) => {
    // Unique filename create karo using timestamp and random string
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = file.originalname.split(".").pop();
    cb(null, `department-${uniqueSuffix}.${extension}`);
  },
});

const uploadsDep = multer({
  storage: storageDep,
  fileFilter: (req, file, cb) => {
    // Allow only specific image formats
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});
//http://localhost:8081/department
app.post("/department", uploadsDep.single("image"), CreateDepartment);
app.put("/department", uploadsDep.single("image"), UpdateDepartment);
app.delete("/department", DeleteDepartment);
app.get("/department", GetDepartmentByUniversityId);
//Product Model
const storagePrd = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the folder for storing uploaded files
    cb(null, "uploadsPrd/");
  },
  filename: (req, file, cb) => {
    // Use original file name to avoid mismatches
    cb(null, file.originalname);
  },
});

// File Filter for Images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Accept only image files
  } else {
    cb(new Error("Only image files are allowed!"), false); // Reject other files
  }
};

// Multer Instance
const uploadPrd = multer({
  storage: storagePrd,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
});
//http://localhost:8081/product
app.post("/product", uploadPrd.array("images"), CreateProduct);
app.put("/product", uploadPrd.array("images"), UpdateProduct);
app.delete("/product", DeleteProduct);
app.get("/product", GetProductsByDepartmentId);
app.get("/productDetail", GetProductDetails);
app.put("/updateProductQty", UpdateProductQty);
// Add to cart route
app.post("/add-to-cart", AddToCart);
app.get("/view-cart", GetCart);
app.post("/createOrder", createOrder);
app.put("/quantity", UpdateQuantity);
//
app.post("/getproduct", getProducts);

// Delete cart item route
app.delete("/delete-cart-item", DeleteProductItem);
app.post("/check", Checkout);
// Summary API

//User Model
app.use("/Controller", User);
app.use("/Controller/Location", Location);
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("database connected");
    app.listen(process.env.PORT, () => {
      console.log("Server running at port:" + process.env.PORT);
    });
  })
  .catch(() => {
    console.log("database connection error");
  });
