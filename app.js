const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const User = require("./models/user");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("649acecf168bf304de7f4215")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.error(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://gagangani17:Fullstack@cluster0.hukmuil.mongodb.net/shop?retryWrites=true&w=majority"
  )
  .then((res) => {
    User.findOne().then(user=>{
      if(!user){
        const user=new User({
          name:'gagan',
          email:'gagangani17@gmail.com',
          cart:[]
        })
        user.save()
      }
    })
    app.listen(3001)
  })
  .catch((err) => console.error(err));
