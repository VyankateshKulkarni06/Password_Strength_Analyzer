const router = require("express").Router();
const { analyzer } = require("../functions/analyzer");

router.post("/", async (req, res) => {
    try {
        const { password } = req.body;
        if (!password) return res.status(400).json({ error: "Password is required" });

        const result = await analyzer(password);
        if (result.is_pwned) {
            return res.json(`❌ Password is PWNED! Found ${result.pwned_count} times.`);
        } else {
            return res.json("✅ Password is SAFE (not found in database).");
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;