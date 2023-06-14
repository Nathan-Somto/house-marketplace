import GoogleAuth from "@/components/GoogleAuth";
import Spinner from "@/components/Spinner";
import { auth } from "@/firebase/firebase.config";
import useAuthStore from "@/store/useAuthStore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Head from 'next/head';
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";

function signinPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [togglePassword, setTogglePassword] = useState(false);
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { email, password } = formData;
    setLoading(true);
    try {
      // sign in the user in firebase.
      const cred = await signInWithEmailAndPassword(auth, email, password);
      // login the user in our zustand state.
      login(cred.user);
      // replace the existing route with the explore page.
      router.replace("/welcome");
      
    } catch (err) {
      toast.error("invalid email or password");
    }
    finally{
      setLoading(false);
    }
  }
  return (
    <>
    <Head>
      <title>Continue - Your Journey</title>
    </Head>
      <motion.main key={router.asPath} exit={{opacity:0}} initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.8}} className="bg-primary-grey grid grid-cols-1 min-h-screen lg:grid-cols-2  lg:gap-[10%]">
        <motion.aside 
        initial={{x:'-100%'}}
        animate={{x:'0%'}}
        transition={{duration:1.2, delay:0.3,}}
        className="bg-primary-green rounded-tr-[10%] rounded-br-[10%] lg:flex items-center hidden  justify-center relative min-h-screen">
          <motion.div
          initial={{scale:0}}
          animate={{scale:1}}
          transition={{duration:1.2, ease:"easeIn", delay:1}}
          >
          <Image
            src={"/signin-home.png"}
            alt={"sign in home"}
            width={400}
            height={400}
            priority
          />
          </motion.div>
        </motion.aside>
        <motion.form
         initial={{opacity:0}} animate={{opacity:1}} transition={{duration:1, delay:2.2}}
          onSubmit={handleSubmit}
          className="py-4 flex justify-center w-full px-8 md:w-[80%] md:px-10 mx-auto lg:w-full flex-col space-y-8 lg:px-6 "
        >
          <motion.h1 initial={{y:80,opacity:0}} animate={{y:0,opacity:1}} exit={{y:80, opacity:0}} transition={{duration:0.8, delay:3}}>Welcome Back</motion.h1>
          <div className="w-full">
            <label htmlFor="email" className="font-medium text-gray-600">
              Email
            </label>
            <div className="relative w-[80%] max-w-[500px]">
              <Image
                src={"/svg/personIcon.svg"}
                height={30}
                width={30}
                alt="person icon"
                className="absolute bottom-4  left-3"
              />
              <input
                type="text"
                id="email"
                name="email"
                onChange={handleChange}
                value={formData.email}
                placeholder="Enter email"
                className="input-box"
              />
            </div>
          </div>
          <div className="w-full">
            <label htmlFor="password" className="font-medium text-gray-600">
              Password
            </label>
            <div className="relative w-[80%] max-w-[500px]">
              <Image
                src={"/svg/lockIcon.svg"}
                height={30}
                width={30}
                alt="person icon"
                className="absolute bottom-4  left-3"
              />
              <input
                type={togglePassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Enter Password"
                onChange={handleChange}
                value={formData.password}
                className="input-box px-12"
              />
              {!togglePassword ? (
                <Image
                  onClick={() => setTogglePassword((prevState) => !prevState)}
                  src={"/svg/notVisibleIcon.svg"}
                  height={30}
                  width={30}
                  alt="not visible icon"
                  className="absolute bottom-4  right-3 cursor-pointer"
                />
              ) : (
                <Image
                  onClick={() => setTogglePassword((prevState) => !prevState)}
                  src={"/svg/visibilityIcon.svg"}
                  height={25}
                  width={25}
                  alt="visibility icon"
                  className="absolute bottom-4  right-3 cursor-pointer"
                />
              )}
            </div>
          </div>
          <Link
            href={"/forgot-password"}
            className="text-primary-green text-right text-sm font-medium w-[80%]"
          >
            Forgot Password?
          </Link>
          <div className="flex justify-between w-[80%] items-center">
            <h4 className="text-2xl font-medium text-gray-600">Sign In</h4>
            <button className="relative h-[50px] w-[50px] flex hover:opacity-50 duration-200 ease-in items-center justify-center rounded-full shadow-lg bg-primary-green p-2">
              <Image
                src="/svg/keyboardArrowRightIcon.svg"
                alt="chevron right icon"
                width={30}
                height={30}
              />
            </button>
          </div>
          <GoogleAuth pathname="in" />
          <p className="text-gray-600">
            Don't have an Account{" "}
            <Link href="/signup" className="text-primary-green font-semibold">
              Sign Up
            </Link>
          </p>
        </motion.form>
      </motion.main>
      {loading && <Spinner />}
    </>
  );
}

export default signinPage;
