const express = require('express');
const app = express();
const mongoose = require("mongoose");
require('dotenv').config();
const path = require('path');


// Templating Engine Set
app.set('view engine', 'ejs');
app.set('views', 'views');

// Parsing Content
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// DB connection
mongoose.connect(
    process.env.MONGO_URL,
{ 
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if(err) throw err;
    console.log('Connected to MongoDB!!!')
 });


 const adminRoutes = require('./routes/adminRoutes');
 app.use(adminRoutes);








const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`connected to port ${PORT}`);
    console.log(process.env.SENDGRID_API_KEY)
})