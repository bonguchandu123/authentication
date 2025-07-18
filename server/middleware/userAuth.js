
import jwt from 'jsonwebtoken'





const userAuth  =async (req,res,next) => {
    const {token} = req.cookies;

    if(!token){
        return res.json({success:false,message:'Not authenticated Login again'})
    }
    try {
       const tokenDecode = jwt.verify(token,process.env.JWT_SECRET)
        
        if(tokenDecode.id){
           req.userId = tokenDecode.id;

        }else{
            return res.json({success:false,message:'Not authorizedd login again '})
        }
        next()
    } catch (error) {
        return res.json({success:false,message:error.message})
        
    }
    
}
export default userAuth