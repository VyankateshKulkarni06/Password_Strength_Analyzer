const express = require("express");
const app = express();
app.use(express.json());

const check_pass=require("./routes/check_pass");
const analyzer_model=require("./routes/analyzer");
app.use("/checkPass", check_pass);
app.use("/analyzer", analyzer_model);
app.listen(5000, () => console.log("Server running on port 5000"));