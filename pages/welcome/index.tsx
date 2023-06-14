import useAuthStore from "@/store/useAuthStore";
import { motion } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
function WelcomePage() {
  const user = useAuthStore((state)=> state.user);
  const router = useRouter();
  useEffect(()=>{
    setTimeout(()=>{ router.push('/explore')},3500);
  },[])
  return (
    <>
    <Head>
      <title>Welcome - {user?.displayName}</title>
      </Head>
  
    <motion.main initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.55}} className="bg-primary-green h-screen grid place-items-center text-primary-white">
      <div>
        <div className="h-[100px] overflow-hidden">
          <motion.h1
            initial={{ y: 150 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.85, delay:0.75 }}
            className=""
          >
            Welcome{" "}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 1.7, duration: 0.55 }}
              className="opacity-80 font-medium"
            >
              {user?.displayName}
            </motion.span>
          </motion.h1>
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2.3, duration: 0.65 }}
        >
        <Image
          src={"/girl.png"}
          width={500}
          height={500}
          className="max-w-[500px] h-[300px] object-contain w-[80%]"
          alt="girl welcome image"
        />
        </motion.div>
       
      </div>
    </motion.main>
      </>
  );
}

export default WelcomePage;
