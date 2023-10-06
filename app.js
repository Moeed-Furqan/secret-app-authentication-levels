require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb://0.0.0.0:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});



const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", (req, res) => {
  try { 
    const user = new User({
      email: req.body.username,
      password: md5(req.body.password),
    });
    user.save();
    res.render("secrets");
  } catch (error) {
    console.log(error);
  }
});
app.post("/login", (req, res) => {
    const email =req.body.username;
    const password = md5(req.body.password);
    const user = User.findOne({email:email})
        .then(user => {
            if(user){
                if(user.password === password){
                    res.render("secrets");
                    console.log("user found");
                }
                else {
                    console.log("no user found");
                }
            }
            else{
                console.log("wrong ID or Password");
                res.redirect("login");
            }
        })
        .catch(err => {
            console.log(err);
        })
  });

app.listen(3000, () => {
  console.log("Server is runnnig at port 3000");
});
