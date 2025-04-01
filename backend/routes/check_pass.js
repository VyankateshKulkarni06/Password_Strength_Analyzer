const router = require("express").Router();
const {  PasswordNGram } = require("../models"); // Your models
const isPasswordPwned = require("../hibp_Check"); // Your pwned password check module

// Check if the password is pwned in MongoDB n-grams and in the pwned password database
router.post("/", async (req, res) => {
    try {
        const { password } = req.body;
        if (!password) return res.status(400).json({ error: "Password is required" });

        // Check against "Have I Been Pwned" database
        const hibpResult = await isPasswordPwned(password);
        if (hibpResult.pwned) {
            return res.json(`❌ Password is PWNED! Found ${hibpResult.count} times.`);
        }

        // Check if the password's n-grams exist in our passwordngrams collection
        const nGrams = generateNGrams(password, 4); // Create 4-character n-grams
        const existingMatch = await PasswordNGram.findOne({
            ngram: { $in: nGrams }
        });

        if (existingMatch) {
            // Password found in n-gram database
            return res.json("⚠️ Password is potentially weak, matches a known pattern.");
        }

        return res.json("✅ Password is SAFE (not found in database).");

    } catch (error) {
        console.error("Error during password check:", error);
        res.status(500).json({ error: error.message });
    }
});

// Helper function to generate n-grams
function generateNGrams(password, n = 4) {
    let nGrams = new Set();
    for (let i = 0; i <= password.length - n; i++) {
        nGrams.add(password.substring(i, i + n));
    }
    return [...nGrams];
}

module.exports = router;
