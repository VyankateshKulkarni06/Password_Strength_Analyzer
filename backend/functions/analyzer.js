const axios = require("axios");

async function analyzer(password) {
    try {
        console.log("Sending request to analyze password...");
        const response = await axios.post("https://parthabnave-password-analyzer-api.hf.space/analyze_password/", {
            password: password 
        });
        console.log("API Response status:", response.status);
        console.log("API Response headers:", response.headers);
        console.log("API Response data:", JSON.stringify(response.data, null, 2));
        return response.data;
    } catch (error) {
        console.error("Error analyzing password:", error.response?.data || error.message);
        console.error("Error details:", error.response?.status, error.response?.statusText);
        return { error: "Failed to analyze password" };
    }
}

async function suggester(password){
    try {
        console.log("Sending request to improve password...");
        const response = await axios.post("https://parthabnave-password-analyzer-api.hf.space/improve_password/", {
            password: password 
        });
        console.log("API Response status:", response.status);
        console.log("API Response headers:", response.headers);
        console.log("API Response data:", JSON.stringify(response.data, null, 2));
        return response.data;
    } catch (error) {
        console.error("Error suggesting password:", error.response?.data || error.message);
        console.error("Error details:", error.response?.status, error.response?.statusText);
        return { error: "Failed to suggest password" };
    }
}

module.exports = {analyzer,suggester};