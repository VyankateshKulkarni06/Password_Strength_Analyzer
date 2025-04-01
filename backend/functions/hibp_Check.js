const crypto = require("crypto");
const { PwnedPassword } = require("../../db/hibp_schema"); // Import the model

// Function to check if a password exists in MongoDB
async function isPasswordPwned(password) {
    // Convert password to SHA-1 hash
    const hash = crypto.createHash("sha1").update(password).digest("hex").toUpperCase();

    // Search for the hashed password in MongoDB
    const found = await PwnedPassword.findOne({ hash });

    if (found) {
        console.log(`❌ Password is PWNED! Found ${found.count} times.`);
        return { pwned: true, count: found.count }; // Return both values
    } else {
        console.log("✅ Password is SAFE (not found in database).");
        return { pwned: false, count:0}; // Return both values
    }
}
module.exports=isPasswordPwned;


