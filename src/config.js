const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017/Auth_app")
.then(() => {
    console.log("Database Connected Successfully");
})
.catch((error) => {
    console.error("Database connection error:", error); 
});


const Loginschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// // Define methods on the schema
// Loginschema.methods.generateAccessToken = function() {
//     return 

// Loginschema.methods.generateRefreshToken = function() {
//     return jwt.sign(
//         {
//             _id: this._id
//         },
//         process.env.REFRESH_TOKEN_SECRET,
//         {
//             expiresIn: process.env.REFRESH_TOKEN_EXPIRY
//         }
//     );
// };

const collection = mongoose.model("users", Loginschema);

module.exports = collection;
