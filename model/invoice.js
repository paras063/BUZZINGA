const mongoose=require('mongoose');
const invoiceSchema = new mongoose.Schema({
    invoiceDate:{
        type:Date,
        required:true,
        default: Date.now
    },
    dueDate:{
        type:Date,
        required:true,
        default:Date.now
    },
    firmId:{type:mongoose.SchemaTypes.ObjectId,required:true,ref:"Firm"},
    customerId:{type:mongoose.SchemaTypes.ObjectId,required:true,ref:"Customer"},
    sellerId:{type:mongoose.SchemaTypes.ObjectId,required:true,ref:"User"},
    items:[
        {
        itemId:{
            type:mongoose.SchemaTypes.ObjectId,
            required:true,
            ref:"Product"
        },
        name:{
            type:String,
            required:true,
            lowercase:true,
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
    discount:{
        type:Number,
        required:true
    },
    totalAmt:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:['paid','unpaid','overdue','half-paid'],
        default:"unpaid"
    },
    note:{
        type:String,
        trim:true,
        default:"Thank You!"
    }
},{timestamps:true})

const invoice=mongoose.model('Invoice',invoiceSchema);
module.exports = invoice;
