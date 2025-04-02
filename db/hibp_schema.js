
const mongoose = require("mongoose");

// Automatically connect to MongoDB
mongoose.connect("mongodb://localhost:27017/Password_Analyzer")
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => {
    console.error("❌ Could not connect to MongoDB", err);
    process.exit(1);
});

// Define Schema for Pwned Passwords
const PwnedPasswordSchema = new mongoose.Schema({
    hash: { type: String, required: true, unique: true },
    count: { type: Number, required: true }
}, { collection: "pwned_passwords" }); // Ensure correct collection name


const AcceptedPassSchema = new mongoose.Schema({
    password: { type: String, required: true }
}, { collection: "accepted_passwords" });

// Create Models

const PwnedPassword = mongoose.model("PwnedPassword", PwnedPasswordSchema);
const AcceptedPassword = mongoose.model("AcceptedPassword", AcceptedPassSchema);

module.exports = { PwnedPassword, AcceptedPassword};
