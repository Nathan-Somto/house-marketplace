import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
type props = {
  testimonials: {
    quote: string;
    author: string;
  }[];
};
function Testimonals({ testimonials }: props) {
  const [currentTestimonal, setCurrentTestimonal] = useState(0);
  return (
    <section className="min-h-screen py-32 px-8" id="Testimonals">
      <div data-aos="fade-up">
        <h3>Testimonals</h3>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-6">
          What People say about us
        </h2>
      </div>
      <div className="lg:flex  lg:gap-[20%] items-center lg:flex-row mt-32">
        <div
          data-aos="fade-right"
          className="h-[600px] w-[450px] hidden relative lg:block rounded-md overflow-hidden"
        >
          <Image
            src="/testimonial.jpeg"
            alt="testimonal image"
            fill
            className="object-cover"
          />
          <div className="h-full w-full absolute z-[20] bg-[rgba(0,0,0,0.35)] top-0"></div>
        </div>
        <div
          data-aos="zoom-in"
          className=" w-[80%] lg:w-[450px] py-3 relative overflow-x-hidden "
        >
          <AnimatePresence mode="wait">
            {testimonials.map(
              (testimonal, index) =>
                currentTestimonal === index && (
                  <motion.div
                    key={index}
                    className="w-full space-y-4 "
                    initial={{ x: "-100%" }}
                    animate={{ x: "0" }}
                    exit={{ x: "100%" }}
                    transition={{ duration: 0.85 }}
                  >
                    <p className=" text-lg">{`"${testimonal.quote}"`}</p>
                    <div className="flex space-x-5 items-center">
                      <Image
                        width={60}
                        height={60}
                        alt={`${testimonal.author}-avatar`}
                        src={`/avatar-${index + 1}.jpg`}
                        className="rounded-[50%] hover:scale-110 h-[60px] w-[60px] object-cover border-primary-green border-solid border"
                      />
                      <p>{testimonal.author}</p>
                    </div>
                  </motion.div>
                )
            )}
          </AnimatePresence>
          <div className="flex space-x-3 items-center justify-center ">
            {testimonials.map((_, index) => (
              <button
                className={`border-primary-green transition-all ease-in duration-250 border-solid border shadow-[0_0_10px_#00cc66] ${
                  currentTestimonal === index
                    ? "bg-primary-green"
                    : "bg-transparent"
                } h-[20px] w-[20px] rounded-[50%]`}
                key={index}
                onClick={() => setCurrentTestimonal(index)}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonals;
