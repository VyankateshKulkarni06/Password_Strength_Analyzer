const router=require("express").Router();
const  isPasswordPwned=require("../functions/hibp_Check");

router.post("/", async (req, res) => {
    try {
            const { password } = req.body;
            console.log(password);
            if (!password) return res.status(400).json({ error: "Password is required" });

            const result = await isPasswordPwned(password);
            if(result.pwned==true)
            {
                return res.json(`❌ Password is PWNED! Found ${result.count} times.`)
            }
            else
            {
                return res.json("✅ Password is SAFE (not found in database).")
            }
        }
    catch (error) 
        {
            res.status(500).json({ error: error.message });
        }
});

module.exports=router;