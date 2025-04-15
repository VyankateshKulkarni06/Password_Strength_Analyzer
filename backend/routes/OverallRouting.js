const router = require("express").Router();
const { analyzer, suggester } = require("../functions/analyzer");

router.post("/", async (req, res) => {
    const password = req.body.password;
    console.log("Received password for analysis:", password);

    try {
        const analyzer_response = await analyzer(password);
        console.log("Analyzer response:", JSON.stringify(analyzer_response, null, 2));
        
        const suggester_response = await suggester(password);
        console.log("Suggester response:", JSON.stringify(suggester_response, null, 2));

        if (analyzer_response.error || suggester_response.error) {
            return res.status(500).json({ 
                error: "Failed to process password",
                details: {
                    analyzer: analyzer_response.error,
                    suggester: suggester_response.error
                }
            });
        }

        const combinedResponse = {
            original_analysis: {
                password: password,
                score: analyzer_response.score,
                strength_category: analyzer_response.strength_category,
                time_to_crack: analyzer_response.time_to_crack,
                features: analyzer_response.features
            },
            suggestions: suggester_response.suggestions || [],
            improved_password: suggester_response.improved_password,
            improved_analysis: {
                xgb_analysis: suggester_response.improved_analysis?.xgb_analysis,
                zxcvbn_analysis: suggester_response.improved_analysis?.zxcvbn_analysis,
                hibp: suggester_response.improved_analysis?.hibp
            }
        };

        console.log("Sending combined response:", JSON.stringify(combinedResponse, null, 2));
        res.json(combinedResponse);
    } catch (error) {
        console.error("Error processing password:", error);
        res.status(500).json({ 
            error: "Failed to process password",
            details: error.message 
        });
    }
});

module.exports = router;
