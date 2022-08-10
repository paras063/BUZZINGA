const User = require("../model/user");
const { validationResult } = require("express-validator");

exports.getprofile = async (req, res, next) => {
  res.render("admin/profile", { pageTitle: "User Profile" });
};

exports.editProfile = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      dataEntered: false,
      errorMessage: errors.array()[0].msg,
    });
  }
  const address = {
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
    pincode: req.body.pincode,
  };


  req.user.firstName = req.body.firstName;
  req.user.lastName = req.body.lastName;
  req.user.email = req.body.email;
  req.user.contact = req.body.contact;
  req.user.address = address;
  await req.user.save();
  return req.session.save((err) => {
    res.status(200).json({
      success: true,
      dataEntered: true,
    });
  });
};
