import { motion } from "framer-motion";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
export default function LoadingPage() {
    const router = useRouter();
    useEffect(()=>{
        setTimeout(()=> router.push('/home'),3500);
       
    },[]);
  return (
    <>
      <Head>
        <title>House Marketplace</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="A web application to find houses near you."
        />
        <meta
          name="keywords"
          content="Houses, Market, Offers, Discount, Rent, Sell, Affordable Prices"
        />
      </Head>
      <motion.main
        className="bg-primary-green overflow-hidden h-screen w-full grid place-items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delayChildren: 0.7 }}
      >
        <motion.svg
          initial={{ scale: 0.7 }}
          animate={{
            scale: [0.7, 1, 0.7, 1, 0.7, 1, 1, 100],
          }}
          transition={{
            duration: 3,
            times: [0, 0.8, 1],
            ease: "easeIn",
          }}
          className="fill-primary-white"
          viewBox="0 0 24 24"
          width="70px"
          height="70px"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </motion.svg>
      </motion.main>
    </>
  );
}

