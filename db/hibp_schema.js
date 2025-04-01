
const mongoose = require("mongoose");

// Automatically connect to MongoDB
mongoose.connect("mongodb://localhost:27017/Password_Analyzer", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
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

const passwordNGramSchema = new mongoose.Schema({
    ngram: { type: String, required: true, index: true }, // Indexed for fast lookup
    passwordId: { type: mongoose.Schema.Types.ObjectId, ref: "PwnedPassword", required: true }, // Foreign key
    createdAt: { type: Date, default: Date.now }
  });
  
  // Create a compound index for optimized queries
  passwordNGramSchema.index({ ngram: 1, passwordId: 1 });
  
 
// Define Schema for Accepted Passwords
const AcceptedPassSchema = new mongoose.Schema({
    password: { type: String, required: true }
}, { collection: "accepted_passwords" });

// Create Models

const PwnedPassword = mongoose.model("PwnedPassword", PwnedPasswordSchema);
const PasswordNGram = mongoose.model("PasswordNGram", passwordNGramSchema);
const AcceptedPassword = mongoose.model("AcceptedPassword", AcceptedPassSchema);

module.exports = { PwnedPassword, AcceptedPassword,PasswordNGram};
