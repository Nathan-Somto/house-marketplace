import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
function Nav() {
  const [showMobileNav, setShowMobileNav] = useState(false);
  return (
    <nav className="fixed top-0 h-24 text-primary-black bg-primary-white w-full z-[2]">
      <div className="flex w-full justify-between px-6  items-center  py-6">
        <p>
          <span>
            <svg
              className="inline"
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 0 24 24"
              width="20px"
              fill={`rgb(50,50,50)`}
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </span>{" "}
          <span>Marketplace</span>
        </p>
        <ul className="lg:flex hidden space-x-8  items-center ">
          <li className="border-b border-b-transparent pb-2 transition-all duration-250 ease-in hover:border-b-primary-green border-solid "><Link href="#Services">Our Services</Link></li>
          <li className="border-b border-b-transparent pb-2 transition-all duration-250 ease-in hover:border-b-primary-green border-solid "><Link href="#Testimonals">Testimonals</Link></li>
          <li>
            <Link
              href={"/signin"}
              className="py-[0.55rem] px-8 bg-primary-green text-primary-white font-medium rounded-md"
            >
              Login
            </Link>
          </li>
          <li className="border-b border-b-transparent pb-2 transition-all duration-250 ease-in hover:border-b-primary-green border-solid ">
            <Link href={"/signup"} className="font-medium">
              Register
            </Link>
          </li>
        </ul>
        <div
          onClick={() => setShowMobileNav(true)}
          className="space-y-2 lg:hidden cursor-pointer "
        >
          <span className="block w-8 h-0.5 g bg-gray-600"></span>
          <span className="block w-5 h-0.5 bg-gray-600"></span>
        </div>
      </div>
      {/* Mobile Nav */}
      <AnimatePresence mode="wait">
      {showMobileNav && (
        <motion.div key='div' initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.85}} exit={{opacity:0}} className="fixed top-0 bottom-0 backdrop-blur-md bg-[rgba(0,0,0,0.25)] h-full w-full grid place-items-center">
          <motion.ul  initial={{scale:0}} animate={{scale:1}} transition={{duration:0.85, delay:0.55}} className="flex relative flex-col  text-lg py-8 px-12 rounded-[25px] text-center text-primary-white bg-primary-green h-[250px] w-[220px]">
            <button
              onClick={() => setShowMobileNav(false)}
              className="bg-primary-white text-primary-black text-lg rounded-[50%] h-8 w-8  absolute right-[-50px] top-[-30px]"
            >
              {"X"}
            </button>
            <li className="mb-6 hover:opacity-80">
              <Link href={"/signin"}>Login</Link>
            </li>
            <li className="mb-6 hover:opacity-80">
              <Link href={"/signup"} className="font-medium">
                Register
              </Link>
            </li>
            <li className="mb-6 hover:opacity-80"><Link href="#Services">Our Services</Link></li>
            <li className="mb-6 hover:opacity-80"><Link href="#Testimonals">Testimonals</Link></li>
          </motion.ul>
        </motion.div>
      )}
      </AnimatePresence>
    </nav>
  );
}

export default Nav;
