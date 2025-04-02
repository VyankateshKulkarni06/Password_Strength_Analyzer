const axios = require("axios");

async function analyzer(password) {
    try {
        const response = await axios.post("https://password-analyzer-api.onrender.com/analyze_password/", {
            password: password 
        });

        return response.data;
    } catch (error) {
        console.error("Error analyzing password:", error);
        return { error: "Failed to analyze password" };
    }
}

async function suggester(password){
    try {
        const response = await axios.post("https://password-analyzer-api.onrender.com/improve_password/", {
            password: password 
        });

        return response.data;
    } catch (error) {
        console.error("Error suggesting password:", error);
        return { error: "Failed to suggest password" };
    }
}

module.exports = {analyzer,suggester};
