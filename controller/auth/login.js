const User = require("../../model/user");
const Firm = require("../../model/firm");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

exports.getLogin = async (req, res) => {
  return res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: "",
  });
};

exports.postLogin = async (req, res) => {
  const email = req.body.email.toLowerCase();
  const password = req.body.password.toLowerCase();
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      dataEntered: false,
      errorMessage: errors.array()[0].msg,
    });
  }
  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(422).json({
      success: false,
      dataEntered: false,
      errorMessage: "User Not Found",
    });
  }

  if (!user.isVerified) {
    return res.status(422).json({
      errorMessage: "Email Not Verifed Check Ur Inbox ",
    });
  }

  const doMatch = await bcrypt.compare(password, user.password);
  if (doMatch) {
    req.session.isLoggedIn = true;
    req.session.userId = user._id;
    return req.session.save((err) => {
      res.status(200).json({
        success: true,
        dataEntered: true,
        user: user,
      });
    });
  } else {
    return res.status(422).json({
      success: false,
      dataEntered: false,
      errorMessage: "Invalid Password.",
    });
  }
};

exports.getLogout = async (req, res, next) => {
  try {
    req.session.destroy((err) => {
      res.redirect("/login");
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
