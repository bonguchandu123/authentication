// store/useAuthStore.ts
import { create } from 'zustand'
import axios from 'axios'
import { toast } from 'react-toastify'

const backendUrl = import.meta.env.VITE_BACKEND_URL

export const useAuthStore = create((set,get) => ({
  isLoggedin: false,
  userData: null,

  setIsLoggedin: (isLoggedin) => set({ isLoggedin }),
  setUserData: (userData) => set({ userData }),
  backendUrl:import.meta.env.VITE_BACKEND_URL,

  getUserData: async () => {
    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.get(`${backendUrl}/api/user/data`)
      if (data.success) {
        set({ userData: data.userData })
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  },
  getAuth: async() => {
    try {
        const {data} = await axios.get(backendUrl +'/api/auth/is-auth')
        if(data.success){
            set({isLoggedin:true})
            get().getUserData()

        }
        
    } catch (error) {
        toast.error(error.message)
        
    }
  }
}))
