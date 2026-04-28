/* eslint-disable @typescript-eslint/no-unused-vars */
import api from '@/configs/axios';
import { authClient } from '@/lib/auth-client';
import { Loader2Icon } from 'lucide-react';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';


function Home() {
  const{data:session}=authClient.useSession()
  console.log(import.meta.env.VITE_BASEURL)

  const navigate=useNavigate()
    const [input, setInput] = useState('')
    const [loading,setLoading]=useState(false)
     const onSubmitHandler = async (e:React.FormEvent) => {
    e.preventDefault();
    try{
      if(!session?.user){
        return toast.error('please sign in to create a project')
      }
      else if(!input.trim()){
        return toast.error('please enter a message')
      }
      setLoading(true)
      const{data}=await api.post('/api/user/project',{initial_prompt:input});
      setLoading(false);
      navigate(`/projects/${data.projectId}`)
    }
    catch(error:any){
      setLoading(false);
      toast.error(error?.response?.data?.message||error.message);
      console.log(error);

    }
   
  }



  return (
 <section className="flex flex-col items-center text-white text-sm   px-4 sm:px-6 lg:px-10 mt-8 sm:mt-12 lg:mt-24 max-w-7xl mx-auto font-poppins">
         

        <h1 className="text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight md:leading-[70px] mt-4 sm:mt-8 font-semibold max-w-3xl mx-auto">
          Turn thoughts into websites instantly, with AI.
        </h1>

        <p className="text-center text-sm sm:text-base max-w-md mx-auto mt-4 sm:mt-6">
          Create, customize and publish website faster than ever with our AI site.
        </p>

        <form onSubmit={onSubmitHandler} className="bg-white/10 max-w-4xl  h-30px w-full rounded-xl p-4 mt-10 border border-indigo-600/70 focus-within:ring-2 ring-indigo-500 transition-all">
          <textarea onChange={(e) => setInput(e.target.value)} className="bg-transparent outline-none text-gray-300 resize-none w-full flex-1 mb-4 sm:mb-0" rows={4} placeholder="Describe your presentation in details" required />
          <button className="ml-auto flex items-center gap-2 bg-gradient-to-r from-[#d34ddd] to-indigo-700 rounded-md px-4 py-2">
            {!loading ? 'Create with AI' :
            (
            <>
              Creating <Loader2Icon className='animate-spin size-4 text-white'/>
            </>
        )}
           
          </button>
        </form>

       
      </section>

  )
}


export default Home