const User=require('../model/user');
const Firm=require('../model/firm');
const Product=require('../model/product');
const Customer = require('../model/customer')
const Sales = require('../model/sales')

exports.viewSales=async(req,res)=>{
    const sales = await Sales.find({firmId:req.user.firms}).lean().populate('firmId customerId sellerId invoiceId').exec();
    console.log(sales);
    res.render('admin/viewSales',{pageTitle:"View Sales",sales});
}