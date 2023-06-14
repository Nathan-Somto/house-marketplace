import { GetStaticProps } from "next";
import AuthLayout from "@/components/AuthLayout";
import CategoryLink from "@/components/CategoryLink";
import { collection, query, orderBy, getDocs, limit, Timestamp } from "firebase/firestore";
import { IListing, category } from "@/types";
import Link from "next/link";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { db } from "@/firebase/firebase.config";
type ExploreData = {
  data: IListing;
  id: string;
};
// fetch slider data.
export const getStaticProps: GetStaticProps<{
  listings: ExploreData[];
}> = async () => {
  const docRef = collection(db, "listings");
  const q = query(docRef, orderBy("timestamp", "desc"), limit(5));
  const docSnap = await getDocs(q);
  const listings: ExploreData[] = [];
  docSnap.forEach((doc) => {
    
  let timestampString: string;

  if (typeof doc.data().timestamp === 'string') {
    timestampString = doc.data().timestamp;
  } else if (doc.data().timestamp instanceof Timestamp) {
    timestampString = doc.data().timestamp.toDate().toISOString();
  } else {
    // Handle FieldValue case if necessary
    timestampString = ''; // Set a default value or handle accordingly
  }
    listings.push({
      data: {
        ...(doc.data() as IListing),
        timestamp:timestampString ,
      },
      id: doc.id,
    });
  });
  return {
    props: {
      listings,
    },
    revalidate: 20,
  };
};
type Categories = {
  category: category;
  src: string;
  id: number;
};

function ExplorePage({ listings }: { listings: ExploreData[] }) {

  const categories: Categories[] = [
    { category: "rent", src: "/jpg/rentCategoryImage.jpg", id: 1 },
    { category: "sale", src: "/jpg/sellCategoryImage.jpg", id: 2 },
  ];
  return (
    <section className="px-12 md:px-8 lg:px-2 min-h-screen pt-8 pb-6 space-y-12 bg-primary-grey">
      <div className="flex items-center lg:w-[80%] mx-auto  justify-between">
        <h1>Explore</h1>
        <button
          type="button"
          className="h-[45px] hover:opacity-50 w-[45px]  flex items-center justify-center rounded-[50%]  bg-primary-green shadow-[0px_5px_10px_rgba(0,255,0,0.32)]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 50 50"
            width="25px"
            height="25px"
            fill="#fff"
          >
            <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z" />
          </svg>
        </button>
      </div>
      <div>
        <h2 className="lg:w-[80%] mx-auto mb-5 opacity-80">Recomended</h2>
        {listings.length !== 0 ? (
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={0}
            slidesPerView={1}
            autoplay
            className="h-[300px] overflow-hidden relative rounded-3xl lg:w-[80%] mx-auto "
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
          >
            {listings.map((listing, index) => (
              <SwiperSlide key={`${listing.id}-${index}`}>
                <Link href={`/category/${listing.data.type}/${listing.id}`}>
                  <img
                    src={listing.data.imgUrls[0]}
                    alt={listing.data.name}
                    className="object-cover bg-no-repeat h-full bg-center w-full"
                  />
                  <div className="absolute bottom-[10%] left-[5%] p-3 rounded-lg text-primary-white bg-[rgba(0,0,0,0.5)] z-[30]">
                    <p className="text-2xl mb-2 font-semibold">
                      {listing.data.name}
                    </p>
                    <p className="py-1 px-2  bg-primary-white rounded-[2rem] text-primary-black font-semibold inline mr-2">
                      $
                      {listing.data.discountedPrice ??
                        listing.data.regularPrice}{" "}
                      {listing.data.type === "rent" ? "/ month" : ""}
                    </p>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p>There are currently no recomendable listings.</p>
        )}
      </div>
      <div>
        <h3 className="lg:w-[80%] mx-auto mb-5 opacity-80">Categories</h3>
        <div className="flex items-center space-x-[5%]  lg:space-x-[10%] lg:w-[80%] mx-auto ">
          {categories.map((category) => (
            <CategoryLink
              key={category.id}
              src={category.src}
              category={category.category}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

ExplorePage.getLayout = function getLayout(page: JSX.Element) {
  return <AuthLayout>{page}</AuthLayout>;
};
export default ExplorePage;
