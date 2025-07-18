import React from 'react'
import { useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
  import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
  const nav = useNavigate()
  const [st,setSt] = useState("Sign up");
  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const {backendUrl,setIsLoggedin} = useAuthStore()


  console.log(backendUrl)

  const onSubmitHandler = async(e) => {
    e.preventDefault()
    try {
      axios.defaults.withCredentials = true
      if(st === "Sign up"){
        const {data}= await axios.post(backendUrl + '/api/auth/register',{name,email,password})
        if(data.success){
          setIsLoggedin(true)
          nav('/')
          

        }else{
          toast.error(data.message)
        }

      }else{
        const {data}= await axios.post(backendUrl + '/api/auth/login',{email,password})
         if(data.success){
          setIsLoggedin(true)
          nav('/')
          

        }else{
          toast.error(data.message)
        }
        


      }
      
    } catch (error) {
      console.log(error.message)
      toast.error(error.message)
      
    }

  }

  
  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>

      <img  src={assets.logo} alt=""  className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'/>
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>{st === "Sign up"? 'create account':'login '}</h2>
     
      <p className='text-center text-sm mb-3'> {st === "Sign up"? 'create account':'login to your account '}</p>

      <form onSubmit={onSubmitHandler}>

       {st==="Sign up"?<div className='mb-4 flex items-center1 gap-3 w-full px-5 py-2.5 rounded-full bg-[#333AC5]'>
          <img src={assets.person_icon} alt="" />
          <input onChange={(e) => setName(e.target.value)} value={name}  className='bg-transparent outline-none w-full' type="text" placeholder='full name ' required/>
        </div>:""}
        <div className='mb-4 flex items-center1 gap-3 w-full px-5 py-2.5 rounded-full bg-[#333AC5]'>
          <img src={assets.mail_icon} alt="" />
          <input onChange={(e) => setEmail(e.target.value)} value={email} className='bg-transparent outline-none w-full' type="email" placeholder='email ' required/>
        </div>
        <div className='mb-4 flex items-center1 gap-3 w-full px-5 py-2.5 rounded-full bg-[#333AC5]'>
          <img src={assets.lock_icon} alt="" />
          <input onChange={(e) => setPassword(e.target.value)} value={password}  className='bg-transparent outline-none w-full' type="password" placeholder='password ' required/>
        </div>

        <p onClick={() => nav('/reset-password')} className='mb-4 text-indigo-400 cursor-pointer'> forgot password</p>

        <button className='w-full  rounded-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium '>{st}</button>
        
      </form>

     { st === "Sign up"?<p className='text-center text-gray-400 text-xs mt-4'>Already have an account? {' '}
        <span className='cursor-pointer text-blue-400 underline' onClick={() => setSt("Login")}>Login here</span> </p>:
      <p className='text-center text-gray-400 text-xs mt-4'>Dont have an account ? {' '}
        <span className='cursor-pointer text-blue-400 underline' onClick={() => setSt("Sign up")}>Sign up</span> </p>}
       </div>
    </div>
  )
}

export default Login
