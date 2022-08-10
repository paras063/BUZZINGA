const express = require("express");
const {check, body } = require('express-validator');

const router = express.Router();
const User = require("../model/user");
const signup = require("../controller/auth/signup");
const error=require('../controller/error');
const login = require("../controller/auth/login");
const reset = require("../controller/auth/reset");
const { isNotAuth,isAuth } = require("../middleware/auth");

//home Route
router.get("/",isNotAuth,(req,res,next)=>{
  res.render('home',{pageTitle:'Home'});
})

// Signup Routes
router.get("/signup", isNotAuth, signup.getSignup);
router.post("/signup", isNotAuth,[
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
], signup.postSignup);




//login Routes
router.get('/login',isNotAuth,login.getLogin);
router.post('/login',isNotAuth,[
    check('email')
      .trim()
      .isEmail()
      .withMessage('Please enter a valid email.')
      .normalizeEmail(),
      check('password')
      .trim()
      .not().isEmpty()
      .withMessage('Enter Password'),
],login.postLogin);

router.get('/logout',isAuth,login.getLogout);

// email verification
router.get('/verify/:token',isNotAuth,signup.verifyEmail);

//error routes
router.get('/404',error.get404);
router.get('/500',error.get500);

module.exports = router;
