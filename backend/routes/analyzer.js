const router=require("express").Router();

router.post("/",async(req,res)=>{
    const password=req.body;
    const getdata=await axios.get("https://password-analyzer-api.onrender.com/analyze_password/");
    const extracted_data=getdata.data;
    return extracted_data;
});

module.exports=router;