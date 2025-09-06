import axios from "axios";

const api = axios.create({
    baseURL:`${process.env.NEXT_PUBLIC_API}`,
    headers:{
        "Content-Type":"application/json",
    }
})

api.interceptors.request.use((req)=>{
    const token = localStorage.getItem("token");
    if(token){
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
})

// task api

export const getTodos = ()=> api.get("/tasks");
export const getTaskById = (id)=>api.get(`/tasks/${id}`);
export const addTodo = (id,name)=> api.post("/tasks",{id,name});
export const deleteTodo = (id)=> api.delete(`/tasks/${id}`);
export const updateTodo = (id,updates) => api.patch(`/tasks/${id}`,updates);
export const clearTodoList = ()=>api.delete("/tasks");

// auth api 

export const signup = (userData) => api.post('/auth/signup',userData);

export const login = (userData) => api.post('/auth/login',userData);