import zxcvbn from "zxcvbn";

function handleClick(password) {
    const result = zxcvbn(password);
    console.log(result);
 // Optionally return the result if needed
}

export default handleClick;
