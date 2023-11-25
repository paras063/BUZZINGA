const express = require("express");
const {check, body } = require('express-validator');

const router = express.Router();
const User = require("../model/user");
const Product=require('../model/product');
const admin= require('../controller/admin/admin')
const firm= require('../controller/firm');
const profile=require('../controller/profile')
const invoice=require('../controller/invoice');
const product=require('../controller/product');
const sales=require('../controller/sales');
const user=require('../controller/user');

const { isAuth, isOwner } = require("../middleware/auth");

router.get('/dashboard',isAuth,admin.dashboard);

// firm routes
router.get('/firm',isAuth,firm.getFirm);
router.post('/firm',[
    check('name')
    .trim()
    .isLength({ min: 3})
    .withMessage('Name is Too Short'),
    body('ownerId','owner Id')
    .trim(),
    check('email')
      .trim()
      .isEmail()
      .withMessage('Please enter a valid email.')
      .normalizeEmail(),
      check('address')
      .trim().not().isEmpty().withMessage('Enter Address'),
      check('city').trim().not().isEmpty().withMessage('Enter City'),
      check('state').trim().not().isEmpty().withMessage('Enter State'),
      check('country').trim().not().isEmpty().withMessage('Enter Country'),
      check('pincode')
      .trim()
      .isNumeric()
      .withMessage('Please enter a valid pincode.'),
      check('gstNo')
      .isAlphanumeric()
      .withMessage('Enter Valid Gst No.')
      .trim(),
      check('contact')
      .trim()
      .isMobilePhone()
      .withMessage('Please enter a valid Contact number'),
      check('type')
      .trim()
        .not().isEmpty()
        .withMessage('Choose Firm Type')
],isAuth,isOwner,firm.postFirm);


// Invoice routes
router.get('/addInvoice',isAuth,invoice.getInvoice);
router.get('/printInvoice/:invoiceID',isAuth,invoice.printInvoice);
router.get('/getItems/:firmId',isAuth,invoice.getItems);
router.post('/addInvoice',isAuth,[
  check('invoiceDate')
  .trim()
  .not().isEmpty()
  .withMessage('Select Invoice Date')
  .isDate()
  .withMessage('Enter Valid Date'),
  check('dueDate')
  .trim()
  .not().isEmpty()
  .withMessage('Select Due Date')
  .isDate()
  .withMessage('Enter Valid Date'),
  check('firmId')
  .trim()
  .not().isEmpty()
  .withMessage('Select Firm'),
  check('firstName')
    .trim()
    .isAlpha() 
    .withMessage('Enter Valid First Name.')
    .isLength({ min: 2 })
    .withMessage('Name is Too Short'),
    check('lastName')
    .trim()
    .isAlpha()
    .withMessage('Enter Valid Last Name.')
    .isLength({ min: 2 })
    .withMessage('Name is Too Short'),
    check('email')
      .trim()
      .isEmail()
      .withMessage('Please enter a valid email.')
      .normalizeEmail(),
      check('contact')
      .trim()
      .isMobilePhone()
      .withMessage('Please enter a valid Contact number'),
      check('address')
      .trim().not().isEmpty().withMessage('Enter Address'),
      check('city').trim().not().isEmpty().withMessage('Enter City'),
      check('state').trim().not().isEmpty().withMessage('Enter State'),
      check('pincode')
      .trim()
      .isNumeric()
      .withMessage('Please enter a valid pincode.'),
      check('country').trim().not().isEmpty().withMessage('Enter Country'),
      check('items')
      .isArray({min:1})
      .withMessage('Add Some Items.'),
      check('tax')
      .trim()
      .not().isEmpty()
      .withMessage('Enter Tax')
      .isNumeric()
      .withMessage('Enter Valid Tax Value'),
      check('discount')
      .trim()
      .not().isEmpty()
      .withMessage('Enter Discount')
      .isNumeric()
      .withMessage('Enter Valid Discount Value'),
],invoice.addInvoice);

router.get("/viewInvoice",isAuth,invoice.viewInvoices);

router.post("/sendMail",isAuth,invoice.mailInvoice);
router.post("/updateStatus",isAuth,invoice.updateStatus);


//Sales
router.get('/viewSales',isAuth,sales.viewSales)


//User profile
router.get('/profile',isAuth,profile.getprofile);
router.post('/profile',isAuth,[
  check('firstName')
    .trim()
    .isAlpha() 
    .withMessage('Enter Valid First Name.')
    .isLength({ min: 2 })
    .withMessage('Name is Too Short'),
    check('lastName')
    .trim()
    .isAlpha()
    .withMessage('Enter Valid Last Name.')
    .isLength({ min: 2 })
    .withMessage('Name is Too Short'),
    check('email')
      .trim()
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value}).then(
          (userDoc) => {
            if(userDoc){
            if (userDoc._id.toString() !== req.user._id.toString()) {
              return Promise.reject(
                'E-Mail already exist, please pick a different one.'
              );
            }
          }
          }
        );
      })
      .normalizeEmail(),
      check('contact')
      .trim()
      .isMobilePhone()
      .withMessage('Please enter a valid Contact number'),
      check('address')
      .trim().not().isEmpty().withMessage('Enter Address'),
      check('city').trim().not().isEmpty().withMessage('Enter City'),
      check('state').trim().not().isEmpty().withMessage('Enter State'),
      check('country').trim().not().isEmpty().withMessage('Enter Country'),
      check('pincode')
      .trim()
      .isNumeric()
      .withMessage('Please enter a valid pincode.'),
],profile.editProfile)


// Product routes
router.get('/addproduct',isAuth,product.getAddProduct);

router.post('/addproduct',isAuth,[
  check('productName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name is Too Short'),
    check('firmId')
    .trim()
    .not().isEmpty()
    .withMessage('Select Firm'),
    check('description')
    .trim()
    .not().isEmpty()
    .withMessage('Enter Product Description'),
    check('size').trim().not().isEmpty().withMessage('Enter Size'),
    check('color').trim().not().isEmpty().withMessage('Enter Color'),
    check('price').trim().isNumeric().withMessage('Enter Price'),
    check('stock').trim().isNumeric().withMessage('Enter Quantity')
],product.postAddProduct)

router.get('/viewproduct',isAuth,product.getViewProduct);
router.get('/editproduct/:productId',isAuth,product.getEditProduct);

router.post('/editproduct',isAuth,[
  check('productName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name is Too Short'),
    check('firmId')
    .trim()
    .not().isEmpty()
    .withMessage('Select Firm'),
    check('description')
    .trim()
    .not().isEmpty()
    .withMessage('Enter Product Description'),
    check('size').trim().not().isEmpty().withMessage('Enter Size'),
    check('color').trim().not().isEmpty().withMessage('Enter Color'),
    check('price').trim().isNumeric().withMessage('Enter Price'),
    check('stock').trim().isNumeric().withMessage('Enter Quantity')
],product.postEditProduct);


// user routes (Employee)
router.get('/addEmployee',isAuth,isOwner,user.getAddEmployee);
router.post('/addEmployee',isAuth,isOwner,[
  check('firstName')
    .trim()
    .isAlpha() 
    .withMessage('Enter Valid First Name.')
    .isLength({ min: 2 })
    .withMessage('Name is Too Short'),
    check('lastName')
    .trim()
    .isAlpha()
    .withMessage('Enter Valid Last Name.')
    .isLength({ min: 2 })
    .withMessage('Name is Too Short'),
    check('firmId')
    .trim()
    .not().isEmpty()
    .withMessage('Select Firm'),
    check('email')
      .trim()
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value}).then(
          (userDoc) => {
            if (userDoc) {
              return Promise.reject(
                'E-Mail already exist, please pick a different one.'
              );
            }
          }
        );
      })
      .normalizeEmail(),
      check('contact')
      .trim()
      .isMobilePhone()
      .withMessage('Please enter a valid Contact number'),
      check('address')
      .trim().not().isEmpty().withMessage('Enter Address'),
      check('city').trim().not().isEmpty().withMessage('Enter City'),
      check('state').trim().not().isEmpty().withMessage('Enter State'),
      check('country').trim().not().isEmpty().withMessage('Enter Country'),
      check('pincode')
      .trim()
      .isNumeric()
      .withMessage('Please enter a valid pincode.'),
      check('password')
      .trim()
        .not().isEmpty()
        .withMessage('Enter Password')
        .isLength({ min: 8 })
        .withMessage('Password is Too Short'),
      check('confirmPassword')
      .trim()
        .not().isEmpty()
        .withMessage('Enter Confirm Password')
        .custom((value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('Passwords Doesn`t match!');
          }
          return true;
        })
],user.postAddEmployee);

module.exports = router;
// 

