import axios from "axios";

async function handleClick(password) {
    try {
        console.log("in click function");
        const response = await axios.post("http://localhost:5000/overallAPI", { password });
        return response.data; 
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

export default handleClick;
