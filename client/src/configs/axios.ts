import axios from 'axios';

const api=axios.create({
    baseURL:import.meta.env.VITE_BASEURL || 'https://websitebuilder2.onrender.com',
      // baseURL:import.meta.env.VITE_BASEURL || 'http://localhost:3000',
  
  
    withCredentials:true
})
export default api