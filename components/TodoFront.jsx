import React, { memo, useCallback, useEffect, useRef, useState } from 'react'; 
import { IoMdAddCircleOutline } from "react-icons/io";
import { RiDeleteBin5Line, RiResetRightLine } from "react-icons/ri";
import { FaListCheck } from "react-icons/fa6"; 
import { MdDeleteOutline } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";
import { getTodos, addTodo, clearTodoList, deleteTodo, updateTodo } from "../lib/api";

const TaskUIComponent = memo(function TaskUIComponent({ data, flag, deleteTaskActive, onClick, loadTodos }) {
  const nameOfTask = data.name;
  const columnRef = useRef(null);
  const [isTaskSelected, setIsTaskSelected] = useState(false);

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

  return (
    <tr
      key={data.id}
      onClick={(e) => handleRowClick(e, data.id)}
      ref={columnRef}
      className={`!max-h-[70px] md:text-sm text-xs ${flag ? "shadow-animation" : ""} 
        ${(isTaskSelected && deleteTaskActive) ? "bg-red-500/50 !shadow-red-300 !shadow !border-2 !border-red-300" : ""} 
        ${data.completed && (!deleteTaskActive || isTaskSelected) ? "bg-green-200/75" : ""}`}
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
        <span>{data.createdAt}</span>&nbsp;&nbsp;<span>{data.updatedAt}</span>
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
  const [sessionExpired,setSessionExpired] = useState(false);
  const [user,setUser] = useState(``);
  const formRef = useRef(null);

  const loadTodos = useCallback(async () => {
    try{
      const res = await getTodos();
      setTaskArray(res.data);

    }catch(error){
      setSessionExpired(true);
      setInterval(()=>{
        window.location.href = 'http://your-todoapp.vercel.app/';
      },4000)

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
    setAddedMessageActive(true);
    setTimeout(() => setAddedMessageActive(false), 1500);
    formRef.current?.reset();
    const id = Date.now();
    await addTodo(id, taskName);
    setTask(id);
  };

  const handleLogout = ()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("userName")
    window.location.href = 'http://localhost:3000/';
  }

  return (
    <div id='ToDoFront' className="border-amber-200 border-[0.5px] shadow-amber-300 shadow-lg md:w-[80%] w-[95%] h-[100%] bg-black/5 px-3 pb-10 pt-2">
      <div id='header' className=' flex justify-between border-gray-300 border-b-2 text-[18px] pb-1'>
        <span className='font-semibold align-middle'>Welcome, {user}!</span>
        <div className='!text-white cursor-pointer px-2 py-1 rounded-sm flex justify-center items-center gap-x-0.5 bg-black border-2' onClick={handleLogout}>
          <IoLogOutOutline /> Logout</div>


      </div>
      <h1 className="text-center md:text-2xl text-sm py-2 mb-3 font-bold flex justify-center items-center gap-x-3">
        <FaListCheck /> Your To-Do List...
      </h1>

      <table className={`task-table mb-14 relative min-h-48 ${addedMessageActive?'shadow-animation':''}`}>
        <thead>
          <tr>
            <th>Status</th>
            <th>Assigned Task</th>
            <th>Date & time</th>
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

      <div id="tabBar" className="text-center">
        {tabs.map((_, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            className={`!text-black border-2 border-black bg-gray-50 px-2 mx-2 cursor-pointer ${
              activeTab === index + 1 ? "bg-sky-600 text-white" : ""
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {addedMessageActive && (
        <section id="dialogue" className="text-green-400 font-bold md:text-2xl text-sm text-center py-5">
          Added!
        </section>
      )}

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

      <div id="add-delete-buttons" className="flex gap-10 justify-center mb-10">
        <button
          disabled={deleteTaskActive}
          onClick={handleDeleteClick}
          id="deletebtn"
          className={`bg-red-500 ${deleteTaskActive && "pointer-events-none cursor-none"}`}
        >
          <RiDeleteBin5Line /> Delete Task
        </button>
        <button onClick={handleClearTask} id="clr" className="bg-amber-400">
          <RiResetRightLine /> Clear Task list
        </button>
      </div>

      <div id="display-title-and-add-taskInput">
        <section id="addTask">
          <form className="flex justify-center items-center md:gap-x-10 gap-x-2 gap-y-3" ref={formRef} onSubmit={handleSubmit}>
            <div className="relative">
              <input
                placeholder="Enter your task"
                onChange={handleChange}
                className="border-sky-300 shadow-md border-2 min-w-[100px] md:w-xs py-1 pl-3 rounded-2xl"
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
   {sessionExpired && <h1>Session Expired you are being directed to login page. please login again!!</h1>}
    </div>
  );
}
