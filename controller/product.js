const User = require("../model/user");
const Firm = require("../model/firm");
const Product = require("../model/product");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const { get } = require("express/lib/response");

exports.getAddProduct = async (req, res) => {
  const firms = await User.findById(req.session.userId, "firms")
    .lean()
    .populate("firms",'name')
    .exec();
  const product = {
    _id: "",
    userId: "",
    firmId: {
      _id: "",
      name: "",
    },
    name: "",
    description: "",
    color: "",
    size: "",
    stock: "",
    price: "",
  };
  res.render("admin/addProduct", {
    pageTitle: "Add Product",
    pageHeading: "Add product",
    firms: firms.firms,
    product,
    edit: false,
  });
};

exports.postAddProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      dataEntered: false,
      errorMessage: errors.array()[0].msg,
    });
  }
  const oldProduct = await Product.find(
    { name: req.body.productName },
    { color: 1, size: 1, _id: 0 }
  );
  if (oldProduct) {
    const result = oldProduct.find((op) => {
      if (op.color == req.body.color && op.size == req.body.size) return true;
    });
    if (result) {
      return res.status(422).json({
        success: false,
        dataEntered: false,
        errorMessage: "Product already exist with same color and size.",
      });
    }
  }
  const product = await Product.create({
    name: req.body.productName,
    firmId: req.body.firmId,
    userId: req.user._id,
    description: req.body.description,
    color: req.body.color,
    size: req.body.size,
    price: req.body.price,
    stock: req.body.stock,
  });
  if (product) {
    return res.status(200).json({
      success: true,
      dataEntered: true,
    });
  }
};

exports.getViewProduct = async (req, res) => {
  const products = await Product.find({ firmId: req.user.firms })
    .lean()
    .populate("firmId", "name")
    .exec();
  res.render("admin/viewProduct", { pageTitle: "View Products", products });
};

exports.getEditProduct = async (req, res) => {
  const productId = req.params.productId;
  const product = await Product.findOne({ _id: productId })
    .lean()
    .populate("firmId", "name")
    .exec();
  res.render("admin/addProduct", {
    pageTitle: "Edit Product",
    pageHeading: "Edit product",
    product: product,
    firms: [{
      _id:"",
      name:""
    }],
    edit: true,
  });
};

exports.postEditProduct = async(req,res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      dataEntered: false,
      errorMessage: errors.array()[0].msg,
    });
  }
  const oldProduct = await Product.find(
    { name: req.body.productName},
    { color: 1, size: 1, _id: 0 }
  );
  if (oldProduct) {
    const result = oldProduct.find((op) => {
      if (op.color == req.body.color && op.size == req.body.size) return true;
    });
    if (result) {
      return res.status(422).json({
        success: false,
        dataEntered: false,
        errorMessage: "Product already exist with same color and size.",
      });
    }
  }
  const product = await Product.findById(req.body.productId);
    product.name= req.body.productName
    product.firmId= req.body.firmId
    product.userId= req.user._id
    product.description= req.body.description
    product.color= req.body.color
    product.size= req.body.size
    product.price= req.body.price
    product.stock= req.body.stock
    await product.save();
    return res.status(200).json({
      success: true,
      dataEntered: true,
    });
};
