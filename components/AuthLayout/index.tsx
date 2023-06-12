import { ReactNode, useEffect } from "react"
import Navbar from "../Navbar"
import { onAuthStateChanged } from "firebase/auth"
import useAuthStore from "@/store/useAuthStore"
import { auth } from "@/firebase/firebase.config";
import { useRouter } from "next/router";
import Spinner from "../Spinner";

function AuthLayout({children}:{children:ReactNode}) {
    const user = useAuthStore((state)=>state.user);
    const login = useAuthStore((state)=>state.login);
    const router = useRouter();
    useEffect(()=>{
    const unSubscribe = onAuthStateChanged(auth,(user)=>{
        if(user !== null){
          login(user);
        }
        else{
          router.push('/signin')
        }
    });
    return () => unSubscribe();
  },[router,login]);
  if(user === null)
  {
    <Spinner/>
  }
  return (
    <>
    <Navbar/>
    <main className="md:max-w-[calc(100%-250px)] md:ml-auto md:mb-0 mb-[110px] w-full">
        {children}
    </main>
    </>
  )
}

export default AuthLayout