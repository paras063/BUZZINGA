const mongoose=require('mongoose');
const { isEmail }= require('validator');
const invoiceSchema = new mongoose.Schema({
    invoiceDate:{
        type:Date,
        required:true,
        default: Date.now
    },
    PaymentTerms:{
        type:String,
        required:true
    },
    dueDate:{
        type:Date,
        required:true,
        default:Date.now
    },
    customerName:{
        type:String,
        required:true,
        trim:true,
        minlength:3
    },
    customerEmail:{
        type:String,
        required:true,
        trim:true,
        validate:[isEmail,'invalid Email']
    },
    customerAddress:{
        type : String,
        required:true,
        trim:true
    },
    sellerAddress:{
        type : String,
        required:true,
        trim:true
    },
    items:[
        {
        name:{
            type:String,
            required:true
        },
        quantity:{
            type:Number,
            required:true,
            default:1
        },
        unitPrice:{
            type:Number,
            required:true
        },
        itemTotal:{
            type:Number,
            required:true
        }
    }
],
    tax:{
        type:Number,
        required:true
    },
    totalAmt:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:['paid','unpaid','overdue'],
        default:"unpaid"
    },
    note:{
        type:String,
        trim:true
    }
})

const invoice=mongoose.model('invoice',invoiceSchema);
module.exports = invoice;