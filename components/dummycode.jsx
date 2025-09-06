// import { useState, useEffect } from 'react';
// import { v4 as uuidv4 } from 'uuid';

// export default function TodoList() {
//   const [tasks, setTasks] = useState([]);
//   const [newTask, setNewTask] = useState('');
//   const [selectedTasks, setSelectedTasks] = useState([]);

//   const addTask = () => {
//     if (!newTask.trim()) return;
//     const task = {
//       id: uuidv4(),
//       text: newTask,
//       completed: false,
//       animate: true,
//     };
//     setTasks([task, ...tasks]);
//     setNewTask('');
//   };

//   const toggleComplete = (id) => {
//     setTasks((prev) =>
//       prev.map((task) =>
//         task.id === id ? { ...task, completed: !task.completed } : task
//       )
//     );
//   };

//   const toggleSelect = (id) => {
//     setSelectedTasks((prev) =>
//       prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
//     );
//   };

//   const deleteTasks = () => {
//     if (
//       selectedTasks.length > 0 &&
//       confirm(`Are you sure you want to delete ${selectedTasks.length} task(s)?`)
//     ) {
//       setTasks((prev) => prev.filter((task) => !selectedTasks.includes(task.id)));
//       setSelectedTasks([]);
//     }
//   };

//   // Remove animation after short time
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setTasks((prev) => prev.map((t) => ({ ...t, animate: false })));
//     }, 1000);
//     return () => clearTimeout(timer);
//   }, [tasks]);

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
//       <h1 className="text-2xl font-bold mb-4">Next.js To-Do List</h1>
//       <div className="flex gap-2 mb-4">
//         <input
//           type="text"
//           className="border p-2 rounded w-64"
//           placeholder="Add new task"
//           value={newTask}
//           onChange={(e) => setNewTask(e.target.value)}
//           onKeyDown={(e) => e.key === 'Enter' && addTask()}
//         />
//         <button onClick={addTask} className="bg-blue-500 text-white px-4 py-2 rounded">
//           Add
//         </button>
//         {selectedTasks.length > 0 && (
//           <button onClick={deleteTasks} className="bg-red-600 text-white px-4 py-2 rounded">
//             Delete Selected
//           </button>
//         )}
//       </div>

//       <ul className="w-full max-w-md space-y-2">
//         {tasks.map((task) => (
//           <li
//             key={task.id}
//             className={`flex items-center justify-between p-3 rounded shadow transition-all duration-300
//               ${task.animate ? 'border border-green-500 shadow-green-300' : ''}
//               ${task.completed ? 'bg-green-200' : ''}
//               ${selectedTasks.includes(task.id) ? 'bg-red-200' : ''}`}
//           >
//             <div className="flex items-center gap-3">
//               <input
//                 type="checkbox"
//                 checked={task.completed}
//                 onChange={() => toggleComplete(task.id)}
//               />
//               <span className={`text-lg ${task.completed ? 'line-through text-gray-600' : ''}`}>
//                 {task.text}
//               </span>
//             </div>
//             <button
//               onClick={() => toggleSelect(task.id)}
//               className="text-sm bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
//             >
//               {selectedTasks.includes(task.id) ? 'Unselect' : 'Select'}
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }


// original code todofront 

// import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
// import { IoMdAddCircleOutline } from "react-icons/io";
// import { RiDeleteBin5Line } from "react-icons/ri";
// import { RiResetRightLine } from "react-icons/ri";
// import { FaListCheck } from "react-icons/fa6"; 
// import { v4 as uuidv4 } from 'uuid';
// import { MdDeleteOutline } from "react-icons/md";
// import {getTodos,addTodo,clearTodoList, deleteTodo,updateTodo,getTaskById} from "../lib/api";
// const TaskUIComponent = memo(function TaskUIComponent({data,flag,deleteTaskActive,onClick,loadTodos}){
    
//     const nameOfTask = data.name;
//     const columnRef = useRef(null);
//     const [isTaskSelected,setIsTaskSelected] = useState(false); // if task selected, it gets red => functionality only works when you need to delete task, to acknowledge which task is selected to delete.
//     const [isTaskCompleted,setIsTaskCompleted] = useState(false);
    
    
//     const handleclick = (e,id) =>{
//         // e.stopPropagation();
//        if(!deleteTaskActive) return;
//        setIsTaskSelected(!isTaskSelected);
//        setTimeout(()=>{
//         setIsTaskSelected(false);
//        },10000);
//        onClick(id,isTaskSelected);
//     }

//     const handleChange = async (e)=>{
//         try{
//             const updates = {completed: e.target.checked};
//             await updateTodo(data.id,updates);
//             const response = await getTaskById(data.id);
//             setIsTaskCompleted(response.data.completed);
            
            
//         }
//         catch(error){
//             console.error('error updating task')
//         }
        
//     }



   
//     return(
//         <tr key={data.id} onClick={(e)=>{handleclick(e,data.id)}} ref={columnRef} className={`!max-h-[70px] md:text-sm text-xs ${flag?'shadow-animation':''} ${(isTaskSelected&&deleteTaskActive)?'bg-red-500/50 !shadow-red-300 !shadow !border-2 !border-red-300':''} ${isTaskCompleted&&(!deleteTaskActive || isTaskSelected)?'bg-green-200/75':''}`}>
//             <td><input checked={isTaskCompleted} onChange={handleChange} type="checkbox" name="isComplete" id="status" /></td>
//             <td>{nameOfTask.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</td>
//             <td><span>{data.createdAt}</span>&nbsp;&nbsp;<span>{data.updatedAt}</span></td>
//         </tr>
//     )
// })
// export default function TodoFront() {
//     const [taskArray,setTaskArray] = useState([]); // task array is a state array that stores all the added task and renders them.
//     const [error,setError] = useState(""); // error state to display errors
//     const [task,setTask] = useState(null); //  task state variable which stores latest task object that has been created.
//     const [deletTaskActive,setDeleteTaskActive] = useState(false); // delete button is active, means user want to perform deletion.
//     const [clickedTasksForDeletion,setClickedTasksForDeletion] = useState([]); // when user wants deletion than, some task that has to be deleted as choosed or clicked by him will be stored here
//     const [addedMessageActive,setAddedMessageActive] = useState(false);
//     const [Tabs,setTabs] = useState([]);
//     const [activeTab, setActiveTab] = useState(1);
//     const formRef = useRef(null);
//      useEffect(()=>{
//         loadTodos();

//      },[task,deletTaskActive])
    //  useEffect(()=>{ 
    //     let grid = [];
    //     let chunkSize = 5;
    //     let row = 0;
    //     let j = 0;
    //     while(row < taskArray.length){
    //         let tab = [];
    //         while(j < taskArray.length && j < (row + chunkSize)){
    //             tab.push(taskArray[j]);
    //             j++;
    //         }
    //         row = j;
    //         grid.push(tab);
    //     }
    //     setTabs(grid);
    // },[taskArray]);
//     const handleClick = (index)=>{
//         setActiveTab(++index);
//     }

//     const loadTodos = async ()=>{
//         const res = await getTodos();
//         setTaskArray(res.data);
//     }

//     const createRandomId = ()=>{
//         const str = "0123456789";
//         let id = "";
//         for(let i = 0; i < 6; i++){
//            id = id.concat(str[parseInt(Math.random()*8)]);
           
//         }
//         return id;
//     }

//     // const createTask = (value) =>{
//     //     let d = new Date().toLocaleDateString();
//     //     return {
//     //         taskId:uuidv4(),
//     //         status : false,
//     //         taskName : `${value}`,
//     //         time: new Date().toLocaleTimeString("en-GB",{hour12:false}),
//     //         date: `${d}`
//     //     }
//     // }
//     const handleChange = (e) =>{
//         const {value,name} = e.target;
//         if(!value) setError("The field is mandatory.")
//         else setError("");
//     }


//     const handleSaveTaskClick = ()=>{
//         setAddedMessageActive(false);

//     }

//     const apiDeletion = async (id)=>{
//         await deleteTodo(id);
//         return;
//     }

//     const handleDeleteClick = () =>{
//         if(taskArray.length === 0) return;
//         setDeleteTaskActive(!deletTaskActive);
//         let lengthForClicked = clickedTasksForDeletion.length;
//         setTimeout(()=>{
//             if(lengthForClicked === clickedTasksForDeletion.length) {
//                 setDeleteTaskActive(false);
//                 setClickedTasksForDeletion([]);
//             }
//         },10000);  // delete button deactivates 

//     }

//   const handleTaskClick = async (id = 0,isTaskSelected)=>{{
//         if(id === 0 ) return;
//         if(clickedTasksForDeletion.includes(id)){
//             const newArr = clickedTasksForDeletion.filter((element)=> ! (element === id));
//             setClickedTasksForDeletion(newArr);
//             return;
//         }
//          const idOfClickedTasksForDeletion = [...clickedTasksForDeletion];
//          idOfClickedTasksForDeletion.push(id);
//          setClickedTasksForDeletion(idOfClickedTasksForDeletion);

         
//     }}

//     const handleConfirmDeletion =  () =>{
//         const leftOverTasks = taskArray.filter(num => !clickedTasksForDeletion.includes(num.taskId));
//         setTaskArray(leftOverTasks);
//         setDeleteTaskActive(false);
//         clickedTasksForDeletion.forEach((id,index)=>{
//             apiDeletion(id);
//         })
//         setClickedTasksForDeletion([]); // make the state array empty (id's those were to be deleted are deleted so make the array empty)
//     }

//     const handleClearTask = async () =>{
//         setTask(null);
//         setTaskArray([]);
//         setDeleteTaskActive(false);
//         setError("");
//         setClickedTasksForDeletion([]);
//         await clearTodoList();
//     }

//     const handleSubmit = async (e) =>{
//         e.preventDefault();
//         const formData = new FormData(e.currentTarget);
//         const taskName = formData.get('taskName');
//         if(!taskName){ setError("The field is mandatory");
//             return;
//         }
//         else setError("");
//         // const newTask = createTask(taskName);
//         // const taskList = [...taskArray];
//         // taskList.push(newTask);
//         // setTaskArray(taskList);
//         setAddedMessageActive(true);
//         setTimeout(()=>{setAddedMessageActive(false)},1500)
//         if(formRef.current) {
//             formRef.current.reset();
//         }
//         const id = createRandomId();
//        await addTodo(id,taskName);
//         setTask(id);
         
//     }

//     // useEffect(()=>{console.log(taskArray)},[taskArray])
    
    
//   return (
//     <div className='border-2 border-black md:w-[80%] w-[95%] h-[100%] bg-white px-3 py-2'>
//    <h1 className='text-center md:text-2xl text-sm py-2 mb-3 font-bold flex justify-center items-center gap-x-3'><FaListCheck />
//  Your To-Do List...</h1>

//    <table className='task-table mb-14 relative min-h-48'>
//     <thead>
//         <tr>
//             <th>Status</th>
//             <th>Assigned Task</th>
//             <th>Date & time</th>
//         </tr>
//     </thead>
//     <tbody>
        
//          {Tabs.map((element,index)=>{
          
//               return( 
//                 <>
//                     { (index+1)=== activeTab &&
//                         element.map((child,ind)=>{
//             return(
//      <TaskUIComponent key={child.taskId} onClick={handleTaskClick} data={child} flag={child.taskId === task} deleteTaskActive={deletTaskActive} loadTodos={loadTodos} />
//             )
//           })
//                     }
//                 </>)              
            
//         })}
//     </tbody>
//    </table>

//  <div id='tabBar' className='text-center'>
//            {
//             Tabs.map((element,index)=>{
//                 return(
//                     <>
//                                     <button key={Math.random()} onClick={()=>handleClick(index)} className={`!text-black border-2 border-black bg-gray-50  px-2 mx-2 cursor-pointer ${(activeTab===(index+1))?'bg-sky-600 text-white':''}`}>{index+1}</button>

//                     </>
//                 )
//             })
//         }
//  </div>
   
//         {addedMessageActive?<>  <section id='dialogue' className='text-green-400 font-bold md:text-2xl text-sm text-center py-5 '>Added!</section>
// </>:<></>} 
   


//    <section id='deleteWarning' className='flex justify-center items-center md:gap-x-5 gap-x-2 gap-y-3 flex-wrap mt-5'>
        
//             {clickedTasksForDeletion.length === 0 || !(deletTaskActive) ? <></>:<div className='my-5 flex md:gap-5 gap-2'>
//             <h3 className='font-bold p-3'>Are you sure about deleting the Task!</h3>
//             <button onClick={handleConfirmDeletion} id='delete' className='bg-red-600'><span id='confirmDelete-icon'><MdDeleteOutline /></span> Confirm Deletion</button></div>}
//         </section>

//    <div id='add-delete-buttons' className='flex gap-10 justify-center mb-10'>
//     <button disabled={deletTaskActive} onClick={handleDeleteClick} id='deletebtn' className={`bg-red-500 ${deletTaskActive && 'pointer-events-none cursor-none'}`}><RiDeleteBin5Line /> Delete Task</button>
//     <button onClick={handleClearTask} id='clr' className='bg-amber-400'> <RiResetRightLine /> Clear Task list</button>
//    </div>

//    <div id='display-title-and-add-taskInput'
//     className=''>
//         <section id='addTask' >
//           <form className='flex justify-center items-center md:gap-x-10 gap-x-2 gap-y-3 ' ref={formRef} onSubmit={(e)=>{handleSubmit(e)}} action="">
//              {/* <h3>Enter Your Task Name</h3> */}
//            <div className='relative'>
//             <input placeholder='Enter The Task...' onChange={(e)=>{handleChange(e)}} className='border-black border-2 min-w-[100px] md:w-xs py-1 pl-3 rounded-2xl' type="text" name='taskName' />  
//            {error? <p id='error' className='absolute'>{error}</p> :<></>}</div>        
//            <button onClick={handleSaveTaskClick} disabled={error.length>0?true:false} type='submit' id='save'  className='bg-green-500'><IoMdAddCircleOutline />  Add Task</button>
//           </form>
//         </section>
           
//     </div>

//     {/* <h2 id='quote' className='md: text-3xl text-md px-3 py-2 my-2 text-center'>
//      "Make it simple,<br /><span className='ml-16 mt-7 pl-5'> Make it done,</span> <br /> <span className='ml-28 mt-7 pl-10'>Make it yours."</span>
//     </h2> */}

//     </div>
//   )
// }
