import {create} from 'zustand';

export const useToastStore = create((set)=>({
    message:'',
    openToast:false,
    success:false,
    setMessage:(msg)=>set(()=>({message:msg})),
    setOpenToast:(val)=>set(()=>({openToast:val})),
    setSuccess:(val)=>set(()=>({success:val}))
}))