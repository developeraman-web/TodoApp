import RegisterNLogin from "../../components/RegisterNLogin";
import {useToastStore} from "../../store/toastMessage";
import { MdErrorOutline } from "react-icons/md";
import { useEffect, useState } from "react";
const ToastMessage = ()=>{
  const openToast = useToastStore((state)=>state.openToast);
  const message = useToastStore(state=>state.message);
  const setopenToast = useToastStore(state=>state.setOpenToast);
  const success = useToastStore(state=>state.success);
useEffect(() => {
  if (!openToast) return;

  setTimeout(()=>{
    setopenToast(false);
  },2000)
}, [openToast]);

  return(
    <div className={`text-[15px] h-8 px-6 py-0.5 w-fit flex justify-center items-center gap-x-1 absolute top-1 left-1/2 -translate-x-1/2 text-white shadow-md ${success ? 'bg-green-500':'bg-red-500'} `}>
        <span className="text-sm relative top-0.5"><MdErrorOutline /></span>
        <span>{message}</span>
        <div className={`rounded-s-2xl h-0.5 w-full origin-left absolute bottom-0 progress-bar-negative ${success ? 'bg-green-300':'bg-red-300'}`}></div>
        </div>
  )
}
export default function Home() {
  const openToast = useToastStore(state=>state.openToast);
  return (
   <div className="py-10">
   {openToast
    && 
    <ToastMessage/>
    }
   <RegisterNLogin/>
   </div>
  );
}



