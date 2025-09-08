import React, { memo, useCallback, useEffect, useRef, useState } from 'react'; 
import { IoMdAddCircleOutline } from "react-icons/io";
import { RiDeleteBin5Line, RiResetRightLine } from "react-icons/ri";
import { TiTickOutline } from "react-icons/ti";
import { FaListCheck } from "react-icons/fa6"; 
import { MdDeleteOutline } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";
import { TiMessageTyping } from "react-icons/ti";
import { getTodos, addTodo, clearTodoList, deleteTodo, updateTodo } from "../lib/api";


const TaskUIComponent = memo(function TaskUIComponent({ data, deleteTaskActive, onClick, loadTodos }) {
  const nameOfTask = data.name;
  const columnRef = useRef(null);
  const [isTaskSelected, setIsTaskSelected] = useState(false);
  const [date,setDate] = useState('');

  const handleRowClick = (e, id) => {
    if (!deleteTaskActive) return;
    setIsTaskSelected(!isTaskSelected);
    setTimeout(() => setIsTaskSelected(false), 10000);
    onClick(id, isTaskSelected);
  };

  const handleCheckboxChange = async (e) => {
    try {
      const updates = { completed: e.target.checked };
      await updateTodo(data.id, updates);
      await loadTodos();
    } catch (error) {
      console.error("Error updating task", error);
    }
  };
 
  useEffect(()=>{
 const createdAt = data.createdAt;
let formatted = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
}).format(new Date(createdAt));
setDate(formatted);

  },[])

  return (
    <tr
      key={data.id}
      onClick={(e) => handleRowClick(e, data.id)}
      ref={columnRef}
      className={`!max-h-[70px] md:text-sm text-xs 
        ${(isTaskSelected && deleteTaskActive) ? "bg-red-500/50 !shadow-red-300 !shadow !border-2 !border-red-300" : ""} 
        ${data.completed && (!deleteTaskActive || isTaskSelected) ? "bg-green-100 text-black" : ""}`}
    >
      <td>
        <input
          checked={data.completed}
          onChange={handleCheckboxChange}
          type="checkbox"
          name="isComplete"
         
        />
      </td>
      <td>
        {nameOfTask
          .split(" ")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}
      </td>
      <td>
        <span>{date}</span>
      </td>
    </tr>
  );
});

export default function TodoFront() {
  const [taskArray, setTaskArray] = useState([]);
  const [error, setError] = useState("");
  const [task, setTask] = useState(null);
  const [deleteTaskActive, setDeleteTaskActive] = useState(false);
  const [clickedTasksForDeletion, setClickedTasksForDeletion] = useState([]);
  const [addedMessageActive, setAddedMessageActive] = useState(false);
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [user,setUser] = useState(``);
  const formRef = useRef(null);
  

  const loadTodos = useCallback(async () => {
    try{
      const res = await getTodos();
      setTaskArray(res.data);

    }catch(error){
      


    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [task, deleteTaskActive, loadTodos]);

  useEffect(()=>{
    const userName = localStorage.getItem("userName");
    setUser(userName)
  },[])

  useEffect(() => {
    const chunkSize = 5;
    const grid = [];
    for (let i = 0; i < taskArray.length; i += chunkSize) {
      grid.push(taskArray.slice(i, i + chunkSize));
    }
    setTabs(grid);
  }, [taskArray]);


  const handleClick = (index) => setActiveTab(index + 1);

  const handleChange = (e) => {
    const { value } = e.target;
    setError(value ? "" : "The field is mandatory.");
  };

  const apiDeletion = async (id) => {
    await deleteTodo(id);
  };

  const handleDeleteClick = () => {
    if (taskArray.length === 0) return;
    setDeleteTaskActive(!deleteTaskActive);
    const prevLen = clickedTasksForDeletion.length;
    setTimeout(() => {
      if (prevLen === clickedTasksForDeletion.length) {
        setDeleteTaskActive(false);
        setClickedTasksForDeletion([]);
      }
    }, 10000);
  };

  const handleTaskClick = (id, isTaskSelected) => {
    if (!id) return;
    setClickedTasksForDeletion((prev) =>
      prev.includes(id) ? prev.filter(el => el !== id) : [...prev, id]
    );
  };

  const handleConfirmDeletion = () => {
    setTaskArray((prev) => prev.filter(t => !clickedTasksForDeletion.includes(t.taskId)));
    setDeleteTaskActive(false);
    clickedTasksForDeletion.forEach(apiDeletion);
    setClickedTasksForDeletion([]);
  };

  const handleClearTask = async () => {
    setTask(null);
    setTaskArray([]);
    setDeleteTaskActive(false);
    setError("");
    setClickedTasksForDeletion([]);
    await clearTodoList();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const taskName = formData.get("taskName");
    if (!taskName) {
      setError("The field is mandatory");
      return;
    }
    setError("");
    formRef.current?.reset();
    const id = Date.now();
    await addTodo(id, taskName);
    setTask(id);
    setAddedMessageActive(true);
    setTimeout(() => setAddedMessageActive(false), 1500);
  };

  const handleLogout = ()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("userName")
    window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}`;
  }

  return (
    <div id='ToDoFront' className="border-amber-200 border-[0.5px] shadow-amber-300/40 shadow-lg md:w-[80%] w-[95%] h-[100%] bg-black/5 px-3 pb-10 pt-2">
      <div id='header' className=' flex justify-between border-gray-300 border-b-2 text-[18px] pb-1'>
        <span className='font-semibold align-middle'>Welcome, {user}!</span>
        <div className='!text-white cursor-pointer px-2 py-1 rounded-sm flex justify-center items-center gap-x-0.5 bg-black border-2 hover:rounded-2xl duration-300' onClick={handleLogout}>
          <IoLogOutOutline /> Logout</div>


      </div>
      <h1 className="text-center md:text-2xl text-sm py-2 mb-3 font-bold flex justify-center items-center gap-x-3">
        <FaListCheck /> Your To-Do List...
      </h1>

      <section id='mainBody' className='relative'>
        <table className={`task-table mb-14 relative min-h-40 max-h-48 ${addedMessageActive?'shadow-animation':''}`}>
        <thead>
          <tr>
            <th className='w-[20%]'>Status</th>
            <th className='w-[50%]'>Assigned Task</th>
            <th className='w-[20%]'>Date & time</th>
          </tr>
        </thead>
        <tbody>
          {tabs.map((element, index) =>
            (index + 1) === activeTab &&
            element.map((child) => (
              <TaskUIComponent
                key={child.taskId}
                onClick={handleTaskClick}
                data={child}
                flag={child.taskId === task}
                deleteTaskActive={deleteTaskActive}
                loadTodos={loadTodos}
              />
            ))
          )}
        </tbody>
      </table>

          {addedMessageActive && (
        <section id="dialogue" className={`text-white font-semibold text-[17px] py-1 absolute left-1/2 -translate-x-1/2 -bottom-10  px-3 bg-green-300 border-[1px] border-green-600 z-[1] flex justify-center items-center gap-x-0.5 `}>
         <TiTickOutline />  A new task was added!
        </section>
      )}
      </section>

      <div id="tabBar" className="text-center">
        {tabs.map((_, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            className={` px-2 mx-2 cursor-pointer ${
              activeTab === index + 1 ? "bg-sky-100 text-black border-sky-300 border-2 shadow-md" : "bg-white/5 text-black border-[0.3px] border-black"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      

      <section id="deleteWarning" className="flex justify-center items-center md:gap-x-5 gap-x-2 gap-y-3 flex-wrap mt-5">
        {clickedTasksForDeletion.length > 0 && deleteTaskActive && (
          <div className="my-5 flex md:gap-5 gap-2">
            <h3 className="font-bold p-3">Are you sure about deleting the Task!</h3>
            <button onClick={handleConfirmDeletion} id="delete" className="bg-red-600">
              <MdDeleteOutline /> Confirm Deletion
            </button>
          </div>
        )}
      </section>

      <div id="add-delete-buttons" className="flex gap-10 justify-center mb-10 flex-wrap">
        <button
          disabled={deleteTaskActive}
          onClick={handleDeleteClick}
          id="deletebtn"
          className={`bg-red-500/90 ${deleteTaskActive && "pointer-events-none cursor-none"}`}
        >
          <RiDeleteBin5Line /> Delete Task
        </button>
        <button onClick={handleClearTask} id="clr" className="bg-sky-400">
          <RiResetRightLine /> Clear Task list
        </button>
      </div>

      <div id="display-title-and-add-taskInput">
        <section id="addTask">
          <form className="flex justify-center items-center flex-wrap md:gap-x-10 gap-x-2 gap-y-3" ref={formRef} onSubmit={handleSubmit}>
            <div className="relative border-sky-300 shadow-md border-2 rounded-2xl flex justify-center items-center sm:w-[400px] min-w-[300px]">
              <span className='form-icons absolute top-1/2 -translate-y-1/2 left-2'><TiMessageTyping /></span>
              <input
                placeholder="Enter your task"
                onChange={handleChange}
                className=" px-10 py-2 ring-sky-200 rounded-2xl w-full"
                type="text"
                name="taskName"
              />
              {error && <p id="error" className="absolute">{error}</p>}
            </div>
            <button
              disabled={!!error}
              type="submit"
              id="save"
              className="bg-green-500"
            >
              <IoMdAddCircleOutline /> Add Task
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
