const Firm = require("../model/firm");
const User = require("../model/user");
const mongoose = require('mongoose')

const { validationResult } = require("express-validator");
const req = require("express/lib/request");

exports.getFirm = async(req,res,next)=>{

    const firms=await User.findById(req.session.userId).populate('firms').exec();
    res.render('admin/firm',{pageTitle:'Firm',userName:req.user.firstName+" "+req.user.lastName,firms:firms.firms,ownerId:req.session.userId});
}

exports.postFirm = async(req,res,next)=>{
    const errors=validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
          success: false,
          dataEntered: false,
          errorMessage: errors.array()[0].msg,
        });
      }
      const address={
            address: req.body.address,
          city:req.body.city,
          state:req.body.state,
          country:req.body.country,
          pincode:req.body.pincode
      }
    const firm = await Firm.create({
        name:req.body.name,
        ownerId:req.body.ownerId,
        email:req.body.email,
        contact:req.body.contact,
        address:address,
        gstNo:req.body.gstNo,
        type:req.body.type
    });
    console.log(firm);
    const user=await User.findById(req.body.ownerId);
    user.firms.push(firm._id);
    await user.save();
    return res.status(200).json({
        success: true,
        dataEntered: true,
      });
}