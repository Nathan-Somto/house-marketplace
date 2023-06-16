import GoogleAuth from "@/components/GoogleAuth";
import signupSchema, { signupType } from "@/schema/signup";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import capitalize from "@/utils/capitalize";
import Link from "next/link";
import { User, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "@/firebase/firebase.config";
import useAuthStore from "@/store/useAuthStore";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Spinner from "@/components/Spinner";
import {motion}  from 'framer-motion';
import Head from 'next/head';

function signupPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signupType>({
    resolver: yupResolver(signupSchema),
    mode: "onTouched",
  });
  const [loading,setLoading] = useState(false);
  const [togglePassword, setTogglePassword] = useState(false);
  const [togglePassword2, setTogglePassword2] = useState(false);
  async function onSubmit(data: signupType) {
    setLoading(true);
    let { firstName, password, email } = data;
    firstName = capitalize(firstName);
    try {

      // create the user in firebase.
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      // update the users profile in firebase.
     const updated = await updateProfile(cred.user, {
        displayName: firstName,
      });
      await setDoc(doc(db, "users", cred.user.uid), {
        firstName,
        email,
        timestamp: serverTimestamp(),
      });
      // login in our user in our zustand state.
      login(cred.user);
      
      // replace the existing route to that of the explore page.
      router.replace("/welcome");
    } catch (err) {
      let message = "there was an error while submitting the form.";
      if (err instanceof Error) message = err.message;
      toast.error(message);
    }
    finally{
      setLoading(false);
    }
  }
  return (
    <>
    <Head>
      <title>Join - The fam Today</title>
    </Head>
    <main className="bg-primary-grey grid grid-cols-1 min-h-screen lg:grid-cols-2  lg:gap-[10%]">
      <motion.aside 
        initial={{x:'-100%'}}
        animate={{x:'0%'}}
        transition={{duration:1.2, delay:0.3,}}className="bg-primary-green rounded-tr-[10%] rounded-br-[10%] lg:flex items-center hidden  justify-center relative min-h-screen">
      <motion.div
          initial={{scale:0}}
          animate={{scale:1}}
          transition={{duration:1.2, ease:"easeIn", delay:1}}
          >
        <Image
          src={"/signup-home.png"}
          alt={"sign up home"}
          width={400}
          height={400}
          priority
        />
        </motion.div>
      </motion.aside>
      <motion.form
         initial={{opacity:0}} animate={{opacity:1}} transition={{duration:1, delay:2.2}}
        onSubmit={handleSubmit(onSubmit)}
        className="py-8 flex justify-center w-full px-8 md:w-[80%] md:px-10 mx-auto lg:w-full flex-col space-y-8 lg:px-6 "
      >
        <h1>
          Join the Fam <motion.span initial={{y:80,opacity:0}} animate={{y:0,opacity:1}} exit={{y:80, opacity:0}} transition={{duration:0.8, delay:3}} className="text-primary-green">Today</motion.span>
        </h1>
        <div className="w-full">
          <label
            htmlFor="firstName"
            className={`font-medium text-gray-600 ${
              errors.firstName ? "text-red-500" : ""
            }`}
          >
            First Name
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
              id="firstName"
              {...register("firstName")}
              placeholder="Enter First Name"
              className={`input-box ${errors.firstName ? "input-invalid" : ""}`}
            />
          </div>
          <small className="input-error">{errors?.firstName?.message}</small>
        </div>
        <div className="w-full">
          <label
            htmlFor="email"
            className={`font-medium text-gray-600 ${
              errors.email ? "text-red-500" : ""
            }`}
          >
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
              {...register("email")}
              placeholder="Enter email"
              className={`input-box ${errors.email ? "input-invalid" : ""}`}
            />
          </div>
          <small className="input-error">{errors?.email?.message}</small>
        </div>
        <div className="w-full">
          <label
            htmlFor="password"
            className={`font-medium text-gray-600 ${
              errors.password ? "text-red-500" : ""
            }`}
          >
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
              id="password"
              placeholder="Enter Password"
              {...register("password")}
              className={`input-box px-12 ${
                errors.password ? "input-invalid" : ""
              }`}
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
          <small className="input-error">{errors?.password?.message}</small>
        </div>
        <div className="w-full">
          <label
            htmlFor="confirmPassword"
            className={`font-medium text-gray-600 ${
              errors.confirmPassword ? "text-red-500" : ""
            }`}
          >
            Confirm Password
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
              type={togglePassword2 ? "text" : "password"}
              id="confirmPassword"
              placeholder="Confirm Password"
              {...register("confirmPassword")}
              className={`input-box px-12 ${
                errors.confirmPassword ? "input-invalid" : ""
              }`}
            />
            {!togglePassword2 ? (
              <Image
                onClick={() => setTogglePassword2((prevState) => !prevState)}
                src={"/svg/notVisibleIcon.svg"}
                height={30}
                width={30}
                alt="not visible icon"
                className="absolute bottom-4  right-3 cursor-pointer"
              />
            ) : (
              <Image
                onClick={() => setTogglePassword2((prevState) => !prevState)}
                src={"/svg/visibilityIcon.svg"}
                height={25}
                width={25}
                alt="visibility icon"
                className="absolute bottom-4  right-3 cursor-pointer"
              />
            )}
          </div>
          <small className="input-error">
            {errors?.confirmPassword?.message}
          </small>
        </div>
        <div className="flex justify-between w-[80%] items-center">
          <h4 className="text-2xl font-medium text-gray-600">Sign up</h4>
          <button className="relative h-[50px] w-[50px] flex hover:opacity-50 duration-200 ease-in items-center justify-center rounded-full shadow-lg bg-primary-green p-2">
            <Image
              src="/svg/keyboardArrowRightIcon.svg"
              alt="chevron right icon"
              width={30}
              height={30}
            />
          </button>
        </div>
        <GoogleAuth pathname={"up"} />
        <p className="text-gray-600">
          Have an Account?{" "}
          <Link href="/signin" className="text-primary-green font-semibold">
            Sign In
          </Link>
        </p>
      </motion.form>
    </main>
    {loading && <Spinner/>}
    </>
  );
}

export default signupPage;
