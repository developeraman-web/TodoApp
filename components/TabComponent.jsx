// import React, { act, useEffect, useState } from 'react'

// export default function TabComponent() {
//     const [activeTab, setActiveTab] = useState(1);
//     const [stateArray,setStateArray] = useState([
//   "Olivia", "Liam", "Emma", "Noah", "Ava", "Elijah", "Isabella", "James", "Sophia",
//   "William", "Mia", "Benjamin", "Charlotte", "Lucas", "Amelia", "Henry", "Harper",
//   "Alexander", "Evelyn", "Michael", "Abigail", "Daniel", "Emily", "Matthew", "Elizabeth",
//   "Sebastian", "Camila", "Jackson", "Luna", "Logan", "Sofia", "David", "Avery",
//   "Joseph", "Scarlett", "Samuel", "Madison", "John", "Ella", "Owen", "Grace",
//   "Wyatt", "Chloe", "Luke", "Victoria", "Jayden"
// ]

// );
//     const [Tabs,setTabs] = useState([]);
   
//     useEffect(()=>{
//         let grid = [];
//         let row = 0;
//         let j = 0;
//         while(row < stateArray.length){
//             let tab = [];
//             while(j < stateArray.length && j < (row + 10)){
//                 tab.push(stateArray[j]);
//                 j++;
//             }
//             row = j;
//             grid.push(tab);
//         }
//         setTabs(grid);
//     },[stateArray]);
//     const handleClick = (index)=>{
//         setActiveTab(++index);
//     }
//     useEffect(()=>{
//         console.log(Tabs);
//     },[Tabs])
//   return (
//     <div>
//        <div className='min-h-72'>
//          {Tabs.map((element,index)=>{
          
//               return( 
//                 <>
//                     { (index+1)=== activeTab &&
//                         element.map((child,ind)=>{
//             return(
//                 <li className='font-bold text-black'> {(ind+1)*activeTab} hello {child} !!</li>
//             )
//           })
//                     }
//                 </>)              
            
//         })}
//        </div>

//         {
//             Tabs.map((element,index)=>{
//                 return(
//                     <>
//                                     <button onClick={()=>handleClick(index)} className={`text-black border-2 border-black  px-2 mx-2 cursor-pointer ${(activeTab===(index+1))?'bg-black':''}`}>{index+1}</button>

//                     </>
//                 )
//             })
//         }
//     </div>
//   )
// }



// import React, { useState } from 'react';

// export default function TabComponent() {
//   const [activeTab, setActiveTab] = useState(0);

//   const stateArray = [
//     "Olivia", "Liam", "Emma", "Noah", "Ava", "Elijah", "Isabella", "James", "Sophia",
//     "William", "Mia", "Benjamin", "Charlotte", "Lucas", "Amelia", "Henry", "Harper",
//     "Alexander", "Evelyn", "Michael", "Abigail", "Daniel", "Emily", "Matthew", "Elizabeth",
//     "Sebastian", "Camila", "Jackson", "Luna", "Logan", "Sofia", "David", "Avery",
//     "Joseph", "Scarlett", "Samuel", "Madison", "John", "Ella", "Owen", "Grace",
//     "Wyatt", "Chloe", "Luke", "Victoria", "Jayden"
//   ];

//   // Divide the array into chunks of 10
//   const tabs = [];
//   const itemsPerTab = 10;

//   for (let i = 0; i < stateArray.length; i += itemsPerTab) {
//     tabs.push(stateArray.slice(i, i + itemsPerTab));
//   }

//   return (
//     <div>
//       {/* Display tab content */}
//       <ul className='min-h-72'>
//         {tabs[activeTab]?.map((name, index) => (
//           <li key={index} className='font-bold text-black'>
//             {(index + 1) * (activeTab + 1)} hello {name} !!
//           </li>
//         ))}
//       </ul>

//       {/* Tab buttons */}
//       <div className='mt-4'>
//         {tabs.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => setActiveTab(index)}
//             className={`text-black border-2 border-black bg-gray-500 px-2 mx-2 cursor-pointer ${
//               index === activeTab ? 'bg-gray-900' : ''
//             }`}
//           >
//             {index + 1}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }
