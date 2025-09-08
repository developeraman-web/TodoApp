import React, { useEffect, useState } from 'react'
import TodoFront from '../../components/TodoFront'
import { useToastStore } from '../../store/toastMessage';
import ToastMessage from '../../components/ToastMessage';
export default function tasks() {
  const [isVisible,setIsVisible] = useState(true);
  const setOpenToast = useToastStore((state)=> state.setOpenToast);
  const setMessage = useToastStore((state) => state.setMessage);
  useEffect(()=>{
    const token = localStorage.getItem("token");
    if(!token){
      setIsVisible(false);
      setOpenToast(true);
      setMessage("please, Login!!");
      setTimeout(()=>{
        window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}`;
      },2500)
    }
  },[])
  return (
    <div className="h-full flex justify-center items-center bg-white">
   {isVisible ?  <TodoFront/>:<ToastMessage/>}
    </div>
  )
}
