const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors()); 

const overall_api = require("./routes/OverallRouting");

app.use("/overallAPI", overall_api);

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
