const express = require("express");
const app = express();
app.use(express.json());

const check_pass=require("./routes/check_pass");
app.use("/checkPass", check_pass);
app.listen(5000, () => console.log("Server running on port 5000"));