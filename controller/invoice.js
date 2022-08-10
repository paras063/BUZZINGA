const Invoice = require('../model/invoice');
const User=require('../model/user');
const Firm=require('../model/firm');
const Product=require('../model/product');
const Customer = require('../model/customer')
const Sales = require('../model/sales')

const sgMail = require('@sendgrid/mail');
const { populate } = require('../model/user');
const {validationResult}=require('express-validator');
const customer = require('../model/customer');
const sales = require('../model/sales');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// get add invoice
exports.getInvoice=async(req,res)=>{
    const firms = await User.findById(req.session.userId,'firms').lean().populate('firms','name').exec();
    res.render('admin/addInvoice',{pageTitle:'Add Invoice',firms:firms.firms});
}

// send items
exports.getItems=async(req,res)=>{
    const items = await Product.find({firmId:req.params.firmId},{name:1,stock:1,price:1,size:1,color:1}).lean();
    res.status('200').json({
        success:true,
        items
    })
}

// addinvoice
exports.addInvoice=async(req,res)=>{
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
        success: false,
        dataEntered: false,
        errorMessage: errors.array()[0].msg,
        });
    }

    // find customer or create customer
    let customer;
    const customerFound = await Customer.findOne({email:req.body.email});
    if(customerFound){
        let firmFound=false;
        customerFound.firms.forEach((firm)=>{
            if(firm._id==req.body.firmId) firmFound=true;
        })
        if(!firmFound) customerFound.firms.push(req.body.firmId);
        customer = customerFound;
    }else{
        customer= await Customer.create({
         firstName:req.body.firstName,
         lastName:req.body.lastName,
         email:req.body.email,
         contact:req.body.contact,
         address:{
             address:req.body.address,
             city:req.body.city,
             state:req.body.state,
             pincode:req.body.pincode,
             country:req.body.country
         },
         firms:[req.body.firmId]
        })
    }


    // change stock
   await req.body.items.forEach(async(item)=>{
       const product = await Product.findById(item.itemId);
       product.stock=product.stock-item.quantity;
        await product.save();
    })

    // create invoice
    const invoice = await Invoice.create({
        invoiceDate:req.body.invoiceDate,
        dueDate:req.body.dueDate,
        firmId:req.body.firmId,
        customerId:customer._id,
        sellerId:req.user._id,
        items:req.body.items,
        tax:req.body.tax,
        discount:req.body.discount,
        totalAmt:req.body.totalAmt,
        note:req.body.note
    });

    const sale=await Sales.create({
        saleDate:invoice.invoiceDate,
        firmId:invoice.firmId,
        customerId:invoice.customerId,
        sellerId:invoice.sellerId,
        items:invoice.items,
        totalAmt:invoice.totalAmt,
        invoiceId:invoice._id
    })

    res.status(200).json({ success: true,dataEntered:true });
}

// view all invoices
exports.viewInvoices=async(req,res)=>{
    const invoices = await Invoice.find({firmId:req.user.firms}).lean().populate('firmId sellerId customerId').exec();
    res.render("admin/viewInvoice",{pageTitle:"view invoices",invoices});
}


//change status
exports.updateStatus=async(req,res)=>{
    const invoiceId = req.body._id;
    const status=req.body.status;
    const invoice = await Invoice.findById(invoiceId);
    invoice.status=status;
    await invoice.save();
    res.status(200).json({ success: true , dataEntered:true});
}

// get invoiceid for sending mail
exports.mailInvoice=async(req,res)=>{
        const invoiceId = req.body._id;
        const invoice = await Invoice.findById(invoiceId).lean().populate('firmId customerId sellerId').exec();
        await sendMail(invoice);
        res.status(200).json({ success: true });
}


// Send Mail To USer
const sendMail = async(invoiceDetail) => {
    try{
    let items="";
    for(const item of invoiceDetail.items){
       items = items+`<tr class="item">
       <td>${item.name}</td>

       <td>₹${item.itemTotal}</td>
   </tr>`; 
    }
    const msg = {
      to: invoiceDetail.customerId.email,
      from: 'goyalparas063@gmail.com',
      subject: "bill invoice",
      html: `<!DOCTYPE html>
      <html lang="en">
          <head>
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <title>Invoice</title>
      
              <!-- Favicon -->
              <link rel="icon" href="./images/favicon.png" type="image/x-icon" />
      
              <!-- Invoice styling -->
              <style>
                  body {
                      font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
                      text-align: center;
                      color: #777;
                  }
      
                  body h1 {
                      font-weight: 300;
                      margin-bottom: 0px;
                      padding-bottom: 0px;
                      color: #000;
                  }
      
                  body h3 {
                      font-weight: 300;
                      margin-top: 10px;
                      margin-bottom: 20px;
                      font-style: italic;
                      color: #555;
                  }
      
                  body a {
                      color: #06f;
                  }
      
                  .invoice-box {
                      max-width: 800px;
                      margin: auto;
                      padding: 30px;
                      border: 1px solid #eee;
                      box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
                      font-size: 16px;
                      line-height: 24px;
                      font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
                      color: #555;
                  }
      
                  .invoice-box table {
                      width: 100%;
                      line-height: inherit;
                      text-align: left;
                      border-collapse: collapse;
                  }
      
                  .invoice-box table td {
                      padding: 5px;
                      vertical-align: top;
                  }
      
                  .invoice-box table tr td:nth-child(2) {
                      text-align: right;
                  }
      
                  .invoice-box table tr.top table td {
                      padding-bottom: 20px;
                  }
      
                  .invoice-box table tr.top table td.title {
                      font-size: 45px;
                      line-height: 45px;
                      color: #333;
                  }
      
                  .invoice-box table tr.information table td {
                      padding-bottom: 40px;
                  }
      
                  .invoice-box table tr.heading td {
                      background: #eee;
                      border-bottom: 1px solid #ddd;
                      font-weight: bold;
                  }
      
                  .invoice-box table tr.details td {
                      padding-bottom: 20px;
                  }
      
                  .invoice-box table tr.item td {
                      border-bottom: 1px solid #eee;
                  }
      
                  .invoice-box table tr.item.last td {
                      border-bottom: none;
                  }
      
                  .invoice-box table tr.total td:nth-child(2) {
                      border-top: 2px solid #eee;
                      font-weight: bold;
                  }
      
                  @media only screen and (max-width: 600px) {
                      .invoice-box table tr.top table td {
                          width: 100%;
                          display: block;
                          text-align: center;
                      }
      
                      .invoice-box table tr.information table td {
                          width: 100%;
                          display: block;
                          text-align: center;
                      }
                  }
              </style>
          </head>
      
          <body>
      
              <div class="invoice-box">
                  <table>
                      <tr class="top">
                          <td colspan="2">
                              <table>
                                  <tr>
                                      <td class="title">
                                          <img src="./images/logo.png" alt="Company logo" style="width: 100%; max-width: 300px" />
                                      </td>
      
                                      <td>
                                          Invoice #: ${invoiceDetail._id}<br />
                                          Created: ${invoiceDetail.invoiceDate.getDate()+"-"+invoiceDetail.invoiceDate.getMonth()+"-"+invoiceDetail.invoiceDate.getFullYear()}<br />
                                          Due: ${invoiceDetail.dueDate.getDate()+"-"+invoiceDetail.dueDate.getMonth()+"-"+invoiceDetail.dueDate.getFullYear()}
                                      </td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
      
                      <tr class="information">
                          <td colspan="2">
                              <table>
                                  <tr>
                                      <td>
                                        <h3>Bill from:-</h3>
                                          Buzzinga, Inc.<br />
                                          ${invoiceDetail.sellerId.address}
                                      </td>
      
                                      <td>
                                      <h3>Bill to:-</h3>
                                      ${invoiceDetail.customerId.firstName} ${invoiceDetail.customerId.lastName}<br/>
                                          ${invoiceDetail.customerId.email}<br />
                                          ${invoiceDetail.customerId.address}
                                      </td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                      <tr class="heading">
                          <td>Item</td>
                          <td>Price</td>
                      </tr>
                     ${items}
                      <tr class="total">
                          <td></td>
                          <td>Total:₹${invoiceDetail.totalAmt}</td>
                      </tr>
                  </table>
                  <footer><p>Note:-${invoiceDetail.note}</p></footer>
              </div>
          </body>
      </html>`,
    };
     sgMail.send(msg);
    console.log('email sent');
}
catch(err){
    res.send(err);
}
  };

