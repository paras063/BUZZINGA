const express = require('express');
const sgMail = require('@sendgrid/mail');
const router = express.Router();
const {addInvoice,viewInvoices,mailInvoice,updateStatus}=require('../controller/invoiceController');


router.get('/',(req,res)=>{
    res.render('createInvoice',{pageTitle:"Add Invoice"});
})

router.post('/',addInvoice);

router.get("/view",viewInvoices);

router.post("/sendMail",mailInvoice);
router.post("/updateStatus",updateStatus);
module.exports = router;