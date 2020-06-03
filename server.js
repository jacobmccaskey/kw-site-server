require("dotenv").config();
var express = require("express");

var validator = require("validator");
var bodyParser = require("body-parser");
var cors = require("cors");
var helmet = require("helmet");
var nodemailer = require("nodemailer");

var app = express();

app.use(bodyParser.json());
app.use(helmet());
app.use(cors());

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

app.get("/", (req, res) => {
  res.send(console.log("its working!"));
  res.end("hello");
});

// sends email from contact form in kw-site
app.post("/post", (req, res) => {
  var mailOptions = {
    from: "tampacentralcalendar@gmail.com",
    to: "jacobmccaskey@kw.com",
    subject: ` from ${req.body.name}`,
    text: `${req.body.message} ${req.body.email}`,
  };
  //validation
  if (
    validator.isAscii(req.body.name) === true &&
    validator.isEmail(req.body.email) === true &&
    validator.isAscii(req.body.message) === true
  ) {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(400).send({ error });
      } else {
        console.log("Email sent: " + info.response);
        res.json({ message: "OK" });
      }
    });
  } else {
    res.status(400).send("looks some bad data got thru");
  }
});

app.post("/coaching/post", (req, res) => {
  var mailOptions = {
    from: "tampacentralcalendar@gmail.com",
    to: "icastillo@kw.com",
    subject: ` from ${req.body.name}`,
    text: `${req.body.message} 
    reply-to: ${req.body.email}`,
  };

  if (
    validator.isAlpha(req.body.name) === true &&
    validator.isEmail(req.body.email) === true &&
    validator.isAscii(req.body.message) === true
  ) {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(400).send({ error });
      } else {
        console.log("Email sent: " + info.response);
        res.json({ message: "OK" });
      }
    });
  } else {
    res.status(400).send("looks some bad data got thru");
  }
});

app.listen(5000);
