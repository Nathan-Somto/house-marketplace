import { ReactNode, useEffect, useState } from "react"
import Navbar from "../Navbar"
import { onAuthStateChanged } from "firebase/auth"
import useAuthStore from "@/store/useAuthStore"
import { auth } from "@/firebase/firebase.config";
import { useRouter } from "next/router";
import Spinner from "../Spinner";
import Link from "next/link";

function AuthLayout({children}:{children:ReactNode}) {
    const user = useAuthStore((state)=>state.user);
    const [loading, setLoading] = useState(true);
    const login = useAuthStore((state)=>state.login);
    const logout = useAuthStore((state)=>state.logout)
    const router = useRouter();
    useEffect(()=>{
    const unSubscribe = onAuthStateChanged(auth,(user)=>{
        if(user !== null){ 
          login(user);
        }
        else{
        logout();
        router.push('/signup');
        }
        setLoading(false);  
    });
    return () => unSubscribe();
  },[]);

  if(loading)
  {
    return <Spinner/>;
  }
  if(user === null){
    return (
      <main className="bg-red-500 h-screen grid text-primary-white place-items-center">
        <h1>You cannot access this page login</h1>
        <Link href="/signin">Login</Link>
      </main>
    )
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