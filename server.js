const express = require("express");
const JWT=require("jsonwebtoken")
const path = require("path");
const collection = require("./src/config");
const bcrypt = require('bcrypt');
const dotenv=require("dotenv").config()

const app = express();
// convert data into json format
app.use(express.json());
// Static file
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
//use EJS as the view engine
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

// Register User
app.post("/signup", async (req, res) => {
    console.log(req.body)
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }
    
      const token =JWT.sign({
        id:user._id,
        email:user.email,
        password:user.password
      },
      process.env.ACCESS_KEY,
      {
        expiresIn:process.env.ACCESS_KEY_EXPIRY
      })
      console.log("The generate token is:",token)
    // Check if the email already exists in the database
    const existingUser = await collection.findOne({ email: user.email });
    

    if (existingUser) {
        res.send('Email already exists. Please choose a different username.');
    } else {
        // Hash the password using bcrypt
        const saltRounds = 10; // Number of salt rounds for bcrypt
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);


        user.password = hashedPassword; // Replace the original password with the hashed one

        await collection.insertMany(user); // Use insertOne instead of insertMany for a single document

        // Redirect the user to the signin page after successful signup
        res.redirect('/');
        
    }
});


// Login user 
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ email: req.body.email });
        if (!check) {
            res.send("Email cannot found")
        }
        // Compare the hashed password from the database with the plaintext password
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {

            res.send("wrong Password");
        }
        else {
            res.render("home");
        }
    }
    catch {
        res.send("wrong Details");
    }
});


// Define Port for Application
const port = 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});