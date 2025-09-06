import { create } from 'zustand';
export const useLoginStore = create(
    (set)=>({
        showLoginForm:true,
        setForm:(value) => set((state)=>({showLoginForm:value}))
    })
)