import Navbar from "@/components/Navbar";
import Head from "next/head";
export default function Home(){
    return(
        <>
        <Head>
            <title>House Marketplace</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="description" content="A web application to find houses near you." />
            <meta name="keywords" content="Houses, Market, Offers, Discount, Rent, Sell, Affordable Prices" />
        </Head>
        <main>
            <h1 className="text-xl underline text-violet-600 ">House Marketplace</h1>
            <p className="">Weclome to house marketplace</p>
        </main>
        </>
    )
}
/*
! 
 */