import { motion } from "framer-motion";
import { Dispatch, SetStateAction } from "react";

type props ={
    onDelete: (id: string, name: string) => void;
    showDeleteModal:Dispatch<SetStateAction<boolean>>;
    id:string;
    name:string;
}
function DeleteModal({onDelete, showDeleteModal, id,name}:props) {
    function handleDelete(){
        onDelete(id,name);
        showDeleteModal(false);
    }
  return (
   
    <motion.div initial={{opacity:0}} exit={{opacity:0}}  animate={{opacity:1}} transition={{duration:0.45, delayChildren:1, ease:'easeIn'}} className="fixed top-0 text-primary-black right-0 bottom-0 left-0 z-[9000] h-full w-full bg-[rgba(0,0,0,0.5)]  flex justify-center items-center">
        <motion.div initial={{y:'-100%', scale:0.5}} exit={{y:'-100%'}} animate={{y:'0%', scale:1}} transition={{duration:1.2}} className="bg-primary-white space-y-[30px] relative h-[250px] w-[80%] max-w-[400px] py-8 px-5 rounded-2xl " >
        <h3 className="text-red-600 font-bold text-xl">Confirm Deletion </h3>
        <p className="opacity-80 w-[80%] text-[1.05rem]">Are you sure you want to delete <span className="opacity-100 font-bold">{"basic home condo."}?</span></p>
        <div className="flex  justify-between  items-center">

            <button onClick={()=> showDeleteModal(false)} className=" bg-slate-400  py-2 px-3 rounded-md shadow-md text-primary-white ">Cancel</button>
            <button onClick={handleDelete} className=" bg-red-500 py-2 px-3 rounded-md shadow-md text-primary-white">Delete</button>
        </div>
        
        </motion.div>
    </motion.div>
    
  )
}

export default DeleteModal