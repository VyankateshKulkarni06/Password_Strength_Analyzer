import axios from "axios";

async function handleClick(password) {
    try {
        console.log("Sending password for analysis");
        const response = await axios.post("https://parthabnave-password-analyzer-api.hf.space/analyze_password/", { 
            password 
        });
        console.log("Analysis response:", response.data);

        const improveResponse = await axios.post("https://parthabnave-password-analyzer-api.hf.space/improve_password/", { 
            password 
        });
        console.log("Improvement response:", improveResponse.data);

        // Combine the responses into the expected format
        const combinedData = {
            original_analysis: {
                password: response.data.xgb_analysis.password,
                score: response.data.xgb_analysis.score,
                strength_category: response.data.xgb_analysis.strength_category,
                time_to_crack: response.data.xgb_analysis.time_to_crack,
                features: response.data.xgb_analysis.features
            },
            suggestions: improveResponse.data.suggestions || [],
            improved_password: improveResponse.data.improved_password,
            improved_analysis: improveResponse.data.improved_analysis,
            sequence: response.data.zxcvbn_analysis.sequence,
            hibp: response.data.hibp
        };

        console.log("Combined data:", combinedData);
        return combinedData;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

export default handleClick;
