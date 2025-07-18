import User from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'
import transporter from "../config/nodemailer.js";
import { overwriteMiddlewareResult } from "mongoose";


export const register =async(req,res) => {

    const {name,email,password} = req.body;

    if(!name || !email || !password){
        return res.json({success:false,message:"missing details"})
    }

    try {
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.json({success:false,message:'Useer is already exist'})

        }
        //  hasing the password which is stored in database 
// const salt = await bcrypt.genSalt(10);
// const hash = await bcrypt.hash(password, salt);
// // 
        const hashPass = await bcrypt.hash(password,10);
        const user = new User({
            name,email,password:hashPass
        })


        await user.save();

        // token gen 

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV ==='production'?'none':'strict',
            maxAge:7*24*60*60*1000


        })
         const mailOptions = {
    from: "user.satyavathibongu49@gmail.com",
    to: user.email,
    subject: "Wellcome to chandu web application",
    text: `welcome to chandu website your account has been created with emai id:${email} `
    
  };

  await transporter.sendMail(mailOptions);




        return res.json({success:true})



        

        
    } catch (error) {
        res.json({success:false,message:error.message})
        
    }

}

export const login = async(req,res)=> {
    const {email,password} = req.body;
     if( !email || !password){
        return res.json({success:false,message:"missing email and pass details"})

    }

    try {
        const user = await User.findOne({email})

        if(!user){
            return res.json({success:false,message:'Invalid email'})
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.json({success:false,message:"Invaldi pass"})

        }
         const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV ==='production'?'none':'strict',
            maxAge:7*24*60*60*1000


        })

        return res.json({success:true,})
    } catch (error) {
         res.json({success:false,message:error.message})
    }
    


}

export const logout = async(req,res) => {
    try {
        res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV ==='production'?'none':'strict',
            maxAge:7*24*60*60*1000


        })
        return res.json({success:true,message:"loggeded out succesfully"})
        
    } catch (error) {
        res.json({success:false,message:error.message})
        
    }
}

export const sendVerifyOtp = async(req,res) => {
    try {
        // verifyEmail
const userId = req.userId; // ✅


        const user = await User.findById(userId)

        if(user.isAccountVerified){
            return res.json({success:false,message:"Account Alerady verified"})
        }

       const otp = String(Math.floor(100000+Math.random()* 900000))
       user.verifyOtp = otp;
       user.verifyOtpExpireAt = Date.now() + 24*60*60*1000

       await user.save()

        const mailOptions = {
    from: "user.satyavathibongu49@gmail.com",
    to: user.email,
    subject: "Account verification Otp",
    text: `your Otp is ${otp}. verify your account using this OTP. `
    
  };

  await transporter.sendMail(mailOptions);

  return res.json({success:true,message:'verification OTP send on emial'})


        
    } catch (error) {
        res.json({success:false,message:error.message})
        
    }

}

export const verifyEmail = async (req,res) => {
   // verifyEmail
const userId = req.userId; 
const {otp} = req.body// ✅


    if(!userId || !otp){
        return res.json({success:false,message:'Missing details'})
    }

    try {
        const user = await User.findById(userId)
        if(!user){
        return res.json({success:false,message:'User not found'})

    }

    if(user.verifyOtp === '' || user.verifyOtp !== otp){
        return res.json({success:false,message:'Invalid otp'})
    }
    if(user.verifyOtpExpireAt < Date.now()){
        return res.json({success:false,message:'Otp is expired '})
    }
    user.isAccountVerified = true;
    user.verifyOtp = '';
    user.verifyOtpExpireAt = 0;
    return res.json({success:true,message:'email verified succesfully'})

        
    } catch (error) {
         res.json({success:false,message:error.message})
        
    }
}

export const isAuthenticated = async (req,res) => {
    try {
        return res.json({success:true})
    } catch (error) {
        return  res.json({success:false,message:error.message})
        
    }

    
}

export const sendResetOtp = async (req,res) => {

    const {email} = req.body;
    if(!email){
        return res.json({success:false,message:"email feild is required"})
    }

    try {
        const user = await User.findOne({email})

        if(!user){
            return  res.json({success:false,message:"User not found"})
        }
        const otp = String(Math.floor(100000+Math.random()* 900000))
       user.resetOtp = otp;
       user.resetOtpExpireAt = Date.now() + 15*60*1000

       await user.save()

        const mailOptions = {
    from: "user.satyavathibongu49@gmail.com",
    to: user.email,
    subject: "Account verification Otp",
    text: `your OTp for reseting your password is ${otp}. use this otp to procced with reseting password `

    
  };

  await transporter.sendMail(mailOptions);
  return res.json({success:true,message:"Otp send successfully"})
        
    } catch (error) {
         res.json({success:false,message:error.message})
    }

    
}

//  reset user pass 

export const respassword = async (req,res) => {
    const {email,otp,newPassword} =req.body;
    if(!email || !otp || !newPassword){
        return res.json({success:false,message:"Emil, Otp and new password are req"})
    }
    try {
        const user = await User.findOne({email})

        if(!user){
            return res.json({success:false,message:"User not found "})
        }
        if(user.resetOtp === "" || user.resetOtp !== otp){
            return res.json({success:false,message:'Invaldi OTP'})
        }
        if(user.resetOtpExpireAt < Date.now()){
            return res.json({success:false,message:'Opt expired'})
        }

        const hashedpass = await bcrypt.hash(newPassword,10);
        user.password = hashedpass
        user.resetOtp = ""
        user.resetOtpExpireAt = 0;

        await user.save()



        
    } catch (error) {
        return res.json({success:false,message:error.message})
        
    }
    
}