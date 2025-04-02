const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS

// Import Routes
const check_pass = require("./routes/check_pass");
const analyzer_model = require("./functions/analyzer");
const overall_api = require("./routes/OverallRouting");

// Use Routes
app.use("/checkPass", check_pass);
app.use("/analyzer", analyzer_model);
app.use("/overallAPI", overall_api);

// Start Server
app.listen(5000, () => console.log("🚀 Server running on port 5000"));
