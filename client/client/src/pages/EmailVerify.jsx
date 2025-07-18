import React, { useRef } from 'react'
import { assets } from '../assets/assets'
import { useAuthStore } from '../store/useAuthStore'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const EmailVerify = () => {
  const inputRefs = useRef([])
  const nav = useNavigate()
const {backendUrl,getUserData} = useAuthStore()
  const onSubmitHandler  =async (e) => {
    try {
      e.preventDefault()
      axios.defaults.withCredentials = true
      const otpArray = inputRefs.current.map(e => e.value)
      const otp = otpArray.join('')

      const {data} = await axios.post(backendUrl + '/api/auth/verify-account',{otp})

      if(data.success){
        toast.success(data.message)
        getUserData()
        nav('/')
        
      }else{
        toast.error(data.message)
      }


    } catch (error) {
      toast.error(error.message)
      
    }
    
  }

  const handleInput = (e,i) => {
    if(e.target.value.length > 0 && i < inputRefs.current.length-1){
      inputRefs.current[i + 1].focus()

    }
  }

  const handleKeyDown = (e,i) => {
    if(e.key === 'Backspace' && e.target.value === '' && i > 0){
       inputRefs.current[i -1].focus()

    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('');
    pasteArray.forEach((char,i) => {
      if(inputRefs.current[i]){
        inputRefs.current[i].value = char
      }
      
    });
  }
  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-pink-300 to-purple-400'>
       <img  src={assets.logo} alt=""  className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'/>
         <form onSubmit={onSubmitHandler} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-center font-medium text-xl text-white'>Email verify OTP</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your email id </p>

          <div className='flex justify-between mb-8' onPaste={handlePaste}>
            {Array(6).fill(0).map((_, i) => (
              <input ref={(e) => inputRefs.current[i] = e} onInput={(e) => handleInput(e,i)} onKeyDown={(e) => handleKeyDown(e,i)} type="text" maxLength='1' key={i} required className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'/>

            )) }
            
          </div>
<button type='submit' className='w-full text-white py-2.5 text-center rounded-full bg-gradient-to-r from-blue-500 via-violet-400 to-purple-700'>Verify email</button>


         </form>

     
    </div>
  )
}

export default EmailVerify
