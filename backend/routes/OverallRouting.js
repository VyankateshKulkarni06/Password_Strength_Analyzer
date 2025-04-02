const router=require("express").Router();
const  isPasswordPwned=require("../functions/hibp_Check");
const zxcvbn =require("zxcvbn");
const analyzer=require("../functions/analyzer");
router.post("/",async(req,res)=>{
    const password=req.body.password;

    const pwned_output=await isPasswordPwned(password);
    if(pwned_output)
    {
        console.log("done pwned");
    }
    
    const analyzer_output=await analyzer(password);
    if(analyzer_output)
    {
        console.log("done analyzer");
    }
    
    const zxcvbn_output=zxcvbn(password);

    res.json({
        analyzer_output,
        pwned_output,
        zxcvbn_output,
    });
})

module.exports=router;
