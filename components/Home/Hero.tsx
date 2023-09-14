import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";

function Hero() {
  const [currentImage, setCurrentImage] = useState(0);
  const router = useRouter();
  const imgArr = ["/house-1.jpg", "/house-2.jpg", "/house-3.jpg"];
  return (
    <header className="flex h-screen py-12 space-y-8 lg:py-0 lg:space-y-0 lg:h-[calc(100vh-6rem)] items-center mt-[6rem]  flex-col lg:flex-row overflow-hidden bg-primary-grey">
      <div className="px-8 " data-aos="fade-right">
        <motion.h1 className="text-3xl block md:text-4xl mb-8 py-2 lg:text-5xl !leading-[1.3]  text-primary-black">
          Find Your Dream <br />{" "}
          <span className="text-primary-green">Home</span> Today
        </motion.h1>

        <motion.p className="w-[80%] lg:w-[60%] text-slate-700 leading-6 border-l-primary-black border-solid border-l-2  pl-4 opacity-70 mb-10  ">
          Welcome to house Market Place, here we make finding your dream home
          easy and painless.
        </motion.p>
        <motion.div className="flex items-center gap-[40px]">
          <button
            onClick={() => router.push("/signup")}
            className="bg-primary-green  text-gray-50 sm:text-lg  hover:opacity-75 transition-all ease-in duration-300  font-semibold px-12 rounded-md py-3"
          >
            Get Started
          </button>
          <button
            className="cursor-pointer"
            onClick={() =>
              window.open(
                "https://www.youtube.com/watch?v=09R8_2nJtjg",
                "_blank"
              )
            }
            role="link"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="40px"
              width="40px"
              version="1.1"
              id="Layer_1"
              viewBox="0 0 472.615 472.615"
              xmlSpace="preserve"
              className="rounded-full"
              style={{
                boxShadow: "rgba(0,204,102, 0.5) 0px 0px 10px, rgba(0,204,102, 0.75) 0px 2px 10px 2px",
              }}
            >
              <g>
                <g>
                  <path
                    fill="#00cc66"
                    d="M236.308,0C105.799,0,0,105.798,0,236.308c0,130.507,105.799,236.308,236.308,236.308s236.308-105.801,236.308-236.308    C472.615,105.798,366.816,0,236.308,0z M139.346,347.733V124.88l229.37,111.428L139.346,347.733z"
                  />
                </g>
              </g>
            </svg>
            <span className='sr-only'>Play</span>
          </button>
        </motion.div>
      </div>
      <motion.figure
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.35 }}
        className="h-[calc(100vh-6rem)] overflow-hidden w-[calc(100%-(8*0.25rem))]  mx-auto relative lg:px-0 lg:w-[50%] "
      >
        <AnimatePresence mode="wait">
          {imgArr.map(
            (img, index) =>
              currentImage === index && (
                <motion.div
                  className="h-full relative"
                  key={img}
                  transition={{ duration: 1.2 }}
                  initial={{ x: '100%', opacity: 0 }}
                  exit={{ x: '-100%', opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  <Image src={img} fill className="object-cover" alt={img} priority />
                </motion.div>
              )
          )}
        </AnimatePresence>
        {/* Thumbnails */}
        <div className="flex space-x-6 w-full items-center justify-center absolute bottom-[30px]">
          {imgArr.map((img, index) => {
            return (
              <button  key={`${img}-${index}`}  onClick={() => setCurrentImage(index)} className={`relative h-[50px] md:h-[80px] transition-all ease-out cursor-pointer hover:scale-110  duration-300 w-[50px] md:w-[80px] ${
                currentImage !== index ? "grayscale" : ""
              }`}
                >
                <Image
                  src={img}
                  alt={`${img.split('.')[0]} thumbnail`}
                  fill
                />
              </button>
            );
          })}
        </div>
      </motion.figure>
    </header>
  );
}

export default Hero;
