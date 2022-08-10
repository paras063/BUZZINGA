require("express-async-errors");
const User = require("./model/user");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const path = require("path");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: "mySessions",
});

// Templating Engine Set
app.set("view engine", "ejs");
app.set("views", "views");

// Parsing Content
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

//session
app.use(
  session({
    secret: "This is a secret",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    store: store,
    resave: true,
    saveUninitialized: true,
  })
);

// DB connection
mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("Connected to MongoDB!!!");
  }
);

app.use(async (req, res, next) => {  
  if (!req.session.userId) return next();
  const user = await User.findById(req.session.userId);
  if(!user) return next();
  req.user = user;
  next();
});

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const errorController = require("./controller/error");

app.use(authRoutes);
app.use(dashboardRoutes);
app.use(errorController.get404);
app.use(errorController.get500);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`connected to port ${PORT}`);
  console.log(process.env.SENDGRID_API_KEY);
});
