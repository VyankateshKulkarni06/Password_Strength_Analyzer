const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors()); 

const check_pass = require("./routes/check_pass");
// const analyzer_model = require("./functions/analyzer");
const overall_api = require("./routes/OverallRouting");

app.use("/checkPass", check_pass);
app.use("/overallAPI", overall_api);

app.listen(5000, () => console.log("Server running on port 5000"));
