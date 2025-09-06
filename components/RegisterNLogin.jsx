import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { login, signup } from '../lib/api';
import {useLoginStore} from '../store/login';
import { FaUser } from "react-icons/fa" ;
import { MdEmail } from "react-icons/md"; 
import { RiLockPasswordFill } from "react-icons/ri" 
import { FaEye } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import { useToastStore } from '../store/toastMessage';

function Login(){
  const setForm = useLoginStore((state)=>state.setForm);
  const setOpenToast = useToastStore(state=>state.setOpenToast);
  const setMessage = useToastStore(state=>state.setMessage);
  const openToast = useToastStore(state=>state.openToast);
  const success = useToastStore(state=>state.success);
  const setSuccess = useToastStore(state => state.setSuccess);
  const [loginErrors, setLoginErrors] = useState({message:''});
  const loginForm = useRef(null);
  const {register,handleSubmit, formState: {errors},reset} = useForm({mode:"onSubmit"});
  const onSubmit = async (data)=>{
   try{
     const res = await login(data);
     const token = res.data.token;
     const userName = res.data.user.userName;

     if(!token){
      setOpenToast(true);
      setMessage("Please try again in few minutes");
      return;
     }

     localStorage.setItem("userName",userName);
     localStorage.setItem("token",token);
     window.location.href = "http://your-todoapp.vercel.app/tasks";

   }catch(error){
    let errObj = {message:error.response.data.message};
    setMessage(errObj.message || "something went wrong!");
    setOpenToast(true);
   }finally{
    reset();
   }
   
  }
 
  return (
   <div>
    <form ref={loginForm} id='loginform' className='flex flex-col py-4 justify-center items-center' onSubmit={handleSubmit(onSubmit)}>
   {errors.email && <p className='errors'>{errors.email.message}</p>}
   <div className={`${openToast && !success ? '!border-red-500':''}`}>
     <label htmlFor="email">
      <span className=' form-icons absolute top-1/2 -translate-y-1/2 left-2'><MdEmail /></span>
      </label>
    <input id='email' 
    {...register("email",
    {required:{value:true,message:"Enter Email Address"},
    })}
     type="email"
     className='px-10 py-2 ring-sky-200'
     placeholder= '  E-mail' />
   </div>

    {errors.password && <p className='errors'>{errors.password.message}</p>}

   <div className={`${openToast && !success ? '!border-red-500':''}`}>
     <label htmlFor="password">     
     <span className=' form-icons absolute top-1/2 -translate-y-1/2 left-2'><RiLockPasswordFill /></span>
</label>
    <input {...register("password",
      {required:{value:true,message:"The password field is required"},
      minLength:{value:3,message:"More than 3 charachters"}})}
      type="password" 
      className='px-10 py-2 ring-sky-200'
     placeholder='  Password'/>
   </div>

          <button className='border-2 border-black max-w-fit self-center my-3 bg-sky-400 border-none text-white shadow-sky-300 shadow-sm' type='submit'>Login</button>
    </form>
    {loginErrors.message && <p>{loginErrors.message}</p>}
    <div className='text-center'>Don't have an account? <a className='text-sky-400 font-bold' href='' onClick={(e)=>{e.preventDefault(); setForm(false)}}>Register</a></div>
   </div>
  )
}
function Register(){
  const setOpenToast = useToastStore(state=>state.setOpenToast);
  const setMessage = useToastStore(state=>state.setMessage);
  const setSuccess = useToastStore(state=>state.setSuccess);
  const success = useToastStore(state=>state.success);
  const setForm = useLoginStore((state)=>state.setForm);
  const {register,handleSubmit, formState: {errors,isSubmitSuccessful,isSubmitting},reset} = useForm({mode:"onSubmit",shouldUnregister:false});
  const [showPass,setShowPass] = useState(false);
  const onSubmit = async (data)=>{
   try{
    let userData = {userId:Date.now(),...data};
    const res = await signup(userData);
    const message = `${res.data.message}, please login!`;
    setSuccess(true);
    setMessage(message || "SignUp succesfull!");
    setOpenToast(true);
   }catch(error){
    setSuccess(false);
    setMessage(error.response.data.error || "something went wrong");
    setOpenToast(true);
   }
  }

  useEffect(()=>{
    if(success){
      setForm(true);
    }
  },[success])
  return (
    <div className='flex flex-col'>
      <form id='signupform' className='flex flex-col py-4 justify-center items-center' onSubmit={handleSubmit(onSubmit)}>

          {errors.userName && <p className='errors'>{errors.userName.message}</p>}
        <div>
          <label htmlFor="userName"><span className=' form-icons absolute top-1/2 -translate-y-1/2 left-2'><FaUser /></span></label>
          
          <input
           id='userName'
           name='userName'
           type="text" {...register("userName",
            {required:{value:true,message:"Username is required"},
            minLength:{value:3,message:"should contain atleast 3 characters"}
            })}
            className='px-10 py-2 ring-sky-200' 
            placeholder='  Username'/>
            
            
        </div>

          {errors.email && <p className='errors'>{errors.email.message}</p>}
        <div>
          <label htmlFor="email"><span className=' form-icons absolute top-1/2 -translate-y-1/2 left-2'><MdEmail /></span></label>
    <input id='email'
     {...register("email",
     {required:{value:true,message:"Enter Email Address"},
     })}
      type="email"
      className='px-10 py-2 ring-sky-200'
      placeholder='  Email Id' />
   </div>
     {errors.password && <p className='errors'>{errors.password.message}</p>}

   <div className='flex'>
     <label htmlFor="password"><span className=' form-icons absolute top-1/2 -translate-y-1/2 left-2'><RiLockPasswordFill /></span></label>
    <input
     {...register("password",
     {required:{value:true,message:"The password field is required"},
     minLength:{value:3,message:"More than 3 charachters"}})}
     type={showPass? 'text':'password'}
     className='px-10 py-2 ring-sky-200'
     placeholder='  Password'
      />
   <button type='button' className='cursor-pointer p-3 absolute right-2 top-1/2 -translate-y-1/2 ' onClick={()=>setShowPass(!showPass)}>{showPass? <FaEye /> :<IoMdEyeOff />}</button>

   </div>
          <button className='border-2 border-black max-w-fit self-center my-3 bg-sky-400 border-none text-white shadow-sky-300 shadow-sm' type='submit'>Create Account</button>
            
            
      </form>
          <div className='text-center'>Already have an account? <a className='text-sky-400 font-bold' href='' onClick={(e)=>{e.preventDefault(); setForm(true)}}>Log In</a></div>
      <h2 className='font-semibold py-2 px-2 text-center'><span className='text-red-500' >Note:</span> Please remember your password while sign up because <span className='underline'>forgot password </span> 
          functionality is yet to be implemented.
        </h2>
    </div>
  )
}
export default function RegisterNLogin() {
  const showLoginForm = useLoginStore((state)=>state.showLoginForm);
  const setForm = useLoginStore((state)=>state.setForm);
  return (
    <div className='flex justify-center items-center h-full '>
        <div className='shadow-amber-200 shadow-md border-2 rounded-sm border-amber-200 md:w-md w-[85%] bg-black/5 text-[17px]'>
          <section id='form-header' className='border-b-2 border-black/20 w-full'>
            <div className='flex justify-around'>
              <div className={`cursor-pointer font-semibold py-2.5 px-4 ${showLoginForm ? 'border-b-2 border-sky-500' : ''}`} onClick={()=>setForm(true)}>Login</div>
              <div className={`cursor-pointer font-semibold py-2.5 px-4 ${showLoginForm ? '' : 'border-b-2 border-sky-500'} `} onClick={()=>setForm(false)}>Sign Up</div>

            </div>
          </section>
          <section className='flex justify-center items-center p-4 min-h-72'>
          {showLoginForm ? 
          <div className={`form-animation`}>
            <Login/>
          </div> :
          <div className={`form-animation-reverse`}>
            <Register/>
            </div>}
          </section>
        </div>

       
  
    </div>
  )
}
