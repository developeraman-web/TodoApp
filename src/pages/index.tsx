import RegisterNLogin from "../../components/RegisterNLogin";
import {useToastStore} from "../../store/toastMessage";
import ToastMessage from "../../components/ToastMessage";
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



