import { useRouter } from "next/router";
import {  motion } from "framer-motion";
import { useEffect } from "react";
import Head from "next/head";
import AOS from "aos";
import "aos/dist/aos.css";
import data from "@/data/data.json";
import { Hero, Nav, Services, Testimonals } from "@/components/Home";
function HomePage() {


  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);
  const { services, testimonials } = data;
  return (
    <>
      <Head>
        <title>House Marketplace</title>
      </Head>
      <Nav />
      <Hero />
      <motion.main
        className="min-h-screen relative "
       
      >
        {/* Services */}
        <Services services={services} />
        {/* Testimonals */}
        <Testimonals testimonials={testimonials} />
      </motion.main>
      <footer className="bg-primary-green py-2 px-3 text-primary-white text-center">
        <p>
          Created by{" "}
          <a
            href="https://github.com/Nathan-Somto"
            className=" font-semibold"
            target="_blank"
          >
            Nathan Somto
          </a>{" "}
          {new Date().getFullYear()}
        </p>
      </footer>
    </>
  );
}

export default HomePage;
