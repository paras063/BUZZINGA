const express = require("express");

exports.isAuth = (req, res, next) => {
  req.session.url = req.url;
  if (!req.session.isLoggedIn) return res.redirect("/login");
  next();
};

exports.isNotAuth = (req, res, next) => {
  const url = req.session && req.session.url ? req.session.url : "/dashboard";
  if (req.session.isLoggedIn) return res.redirect(url);
  next();
};

exports.isAdmin=(req,res,next)=>{
  if(req.user.isAdmin){
    next();
  }
  res.redirect('/dashboard');
}

exports.isOwner=(req,res,next)=>{
  if(req.user.typeOfUser == 'owner'){
    next();
  }
  res.redirect('/dashboard')
}



