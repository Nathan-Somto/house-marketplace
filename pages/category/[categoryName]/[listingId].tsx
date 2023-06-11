import AuthLayout from "@/components/AuthLayout";
import Slider from "@/components/Slider";
import { db } from "@/firebase/firebase.config";
import useAuthStore from "@/store/useAuthStore";
import { IListing } from "@/types";
import { doc, getDoc } from "firebase/firestore";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useState } from "react";
type listingData = {
  data: IListing;
  id: string;
};
type notFound = {
  notFound: boolean;
};
export const getServerSideProps: GetServerSideProps<
  { listing: listingData } | notFound
> = async (context) => {
  const { listingId, categoryname } = context.params as ParsedUrlQuery;
  if (categoryname !== "rent" && categoryname !== "sale") {
    return {
      notFound: true,
    };
  }
  const docRef = doc(db, "listing", listingId as string);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return {
      notFound: true,
    };
  }
  const listing = {
    data: docSnap.data() as IListing,
    id: docSnap.id,
  };

  return {
    props: {
      listing,
    },
  };
};
function ListingPage({ listing }: { listing: listingData }) {
  const [linkShare, setLinkShare] = useState(false);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { data: listingData } = listing;
  return (
    <>
      <Head>
        <title>{listingData.name}</title>
      </Head>
      <section className="text-primary-black  pb-6">
        {linkShare && (
          <p className="fixed top-[9%] right-[5%] z-[5] bg-primary-white rounded-2xl py-2 px-4 font-bold shadow-lg">
            The Link was copied to clipboard!
          </p>
        )}
        <header className="relative">
          {/* Back icon */}
          <button
            onClick={() => {
              router.back();
            }}
            className="absolute bg-primary-white rounded-full hover:scale-125 transition-all ease-out duration-300 items-center p-2 shadow-[0_2px_5px_rgba(0,0,0,0.3)] flex justify-center z-[999] top-[20px] left-[30px]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              id="Layer_1"
              version="1.1"
              viewBox="0 0 512 512"
              width="24px"
            >
              <polygon points="352,128.4 319.7,96 160,256 160,256 160,256 319.7,416 352,383.6 224.7,256 " />
            </svg>
          </button>
          <Slider images={listingData.imgUrls} />
          {/* Clipboard icon */}
          <button
            onClick={() => {
              navigator.clipboard
                .writeText(window.location.href)
                .then(() => setLinkShare((prevState) => !prevState))
                .finally(
                  setTimeout(
                    () => setLinkShare((prevState) => !prevState),
                    4000
                  ) as unknown as () => void
                );
            }}
            className="absolute bg-primary-white rounded-full hover:scale-125 transition-all ease-out duration-300 items-center p-2 shadow-[0_2px_5px_rgba(0,0,0,0.3)] flex justify-center z-[999] top-[20px] right-[30px]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#000000"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
            </svg>
          </button>
        </header>
        <div className="px-[5%] mt-12">
          <h1 className="lg:text-4xl mb-4">
            {listingData.name}
            <span> - ${listingData.regularPrice}</span>
          </h1>
          <p className="mb-[0.9rem] text-gray-600 opacity-80">
            {listingData.location}
          </p>
          <div className=" mb-6">
            <p className="py-1 px-2 shadow-[0px_2px_5px_rgb(0,204,102)] bg-primary-green rounded-[2rem] text-primary-white font-semibold inline mr-2">
              for {listingData.type}
            </p>
            {listingData.discountedPrice !== undefined && (
              <p className="py-[0.35rem] px-[0.65rem] bg-primary-black text-primary-white rounded-2xl text-[0.8rem] font-semibold inline">
                {((
                  (listingData.regularPrice - listingData.discountedPrice) /
                  listingData.regularPrice
                ).toFixed(2) as unknown as number) * 100}
                % discount
              </p>
            )}
          </div>
          <ul className=" text-gray-600 opacity-80 font-medium space-y-[0.3rem] mb-8">
            <li>
              {listingData.bedrooms} Bedroom
              {listingData.bedrooms > 1 ? "s" : ""}{" "}
            </li>
            <li>
              {listingData.bathrooms} Bathroom
              {listingData.bathrooms > 1 ? "s" : ""}
            </li>
            {listingData.parking && <li>Parking Spot Available</li>}
            {listingData.furnished && <li>Furnished</li>}
          </ul>
        </div>
        <div className="px-[5%] mb-8">
          <h2 className="mb-3">Location</h2>
          <p className="mb-3 text-gray-600 opacity-80">
            {listingData.location}
          </p>
          {/* Leaflet Map comes here. */}
        </div>
        {listingData.userRef !== user?.uid && (
          <button
            className="primary-btn w-[80%] mx-auto"
            onClick={() => {
              router.push(
                `/contact/${listingData.userRef}/?listingName=${listingData.name}`
              );
            }}
          >
            Contact Landlord
          </button>
        )}
      </section>
    </>
  );
}
ListingPage.getLayout = function getLayout(page: JSX.Element) {
  return <AuthLayout>{page}</AuthLayout>;
};
export default ListingPage;
