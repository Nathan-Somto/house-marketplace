import { auth } from "@/firebase/firebase.config";
import { sendPasswordResetEmail } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";
function forgotPasswordPage() {
  const [email, setEmail] = useState("");
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if(email === '') return;
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success(`we just sent an email to ${email}`);
    } catch (err) {
      toast.error("there was an error while sending the email.");
    }
  }
  return (
    <main className="w-full bg-primary-grey min-h-screen relative">
      <Link href="/" className="absolute top-[30px] left-[30px] fill-[#fff]">
        <Image src="/svg/homeIcon.svg" alt="home icon" width={30} height={30} />
      </Link>
      <form
        onSubmit={handleSubmit}
        className="text-left justify-center h-screen space-y-6 px-6 lg:px-0 max-w-[600px] mx-auto flex flex-col items-center"
      >
        <h1 className="w-full">Forgot Password</h1>
        <div className="w-full">
          <label htmlFor="email" className="font-medium text-gray-600">
            Email
          </label>
          <div className="relative w-full max-w-[600px]">
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
              value={email}
              placeholder="Enter email"
              className="input-box"
            />
          </div>
        </div>
        <Link
          href="/signin"
          className="text-right font-semibold text-primary-green w-full"
        >
          Sign in
        </Link>
        <div className="flex justify-between w-full items-center">
          <h4 className="text-2xl font-medium text-gray-600">
            Send Reset Email
          </h4>
          <button className="relative h-[50px] w-[50px] flex hover:opacity-50 duration-200 ease-in items-center justify-center rounded-full shadow-lg bg-primary-green p-2">
            <Image
              src="/svg/keyboardArrowRightIcon.svg"
              alt="chevron right icon"
              width={30}
              height={30}
            />
          </button>
        </div>
      </form>
    </main>
  );
}

export default forgotPasswordPage;
