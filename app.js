require("dotenv").config();
const { log } = require("console");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

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
    bcrypt.hash(req.body.password, saltRounds).then(function (hash) {
      const user = new User({
        email: req.body.username,
        password: hash,
      });
      user.save();
      res.render("secrets");
    });
  } catch (error) {
    log(error);
  }
});
app.post("/login", (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  const user = User.findOne({ email: email })
    .then((user) => {
      if (user) {
        bcrypt.compare(password, user.password).then(function (result) {
          if (result == true) {
            res.render("secrets");
            log("user found");
          } else {
            log("Wrong Paswword");
          }
        });
      } else {
        log("No user found");
        res.redirect("login");
      }
    })
    .catch((err) => {
      log(err);
    });
});

app.listen(3000, () => {
  log("Server is runnnig at port 3000");
});
