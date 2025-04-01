const mongoose = require("mongoose");
const { PwnedPassword, PasswordNGram } = require("../../db/hibp_schema"); // Import models

// Function to generate n-grams
function generateNGrams(hash, n = 4) {
    let nGrams = new Set();
    for (let i = 0; i <= hash.length - n; i++) {
        nGrams.add(hash.substring(i, i + n));
    }
    return [...nGrams];
}

// Function to process all pwned passwords
async function convertPwnedPasswordsToNGrams() {
    console.log("🔄 Starting conversion of pwned passwords to n-grams...");

    const cursor = PwnedPassword.find().cursor(); // Stream to handle large datasets
    let count = 0;

    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
        const nGrams = generateNGrams(doc.hash, 4);
        const nGramDocs = nGrams.map(ngram => ({
            ngram,
            passwordId: doc._id
        }));

        if (nGramDocs.length > 0) {
            await PasswordNGram.insertMany(nGramDocs);
            count++;
        }

        if (count % 10000 === 0) {
            console.log(`✅ Processed ${count} pwned passwords...`);
        }
    }

    console.log("🎉 Conversion completed successfully!");
    mongoose.connection.close();
}

// Connect to MongoDB and start conversion
mongoose.connect("mongodb://localhost:27017/Password_Analyzer", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("✅ Connected to MongoDB");
    convertPwnedPasswordsToNGrams();
})
.catch(err => {
    console.error("❌ MongoDB Connection Failed", err);
    process.exit(1);
});