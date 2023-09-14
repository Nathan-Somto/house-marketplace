import AuthLayout from "@/components/AuthLayout";
import ListingItem from "@/components/ListingItem";
import LoadMore from "@/components/LoadMore";
import Spinner from "@/components/Spinner";
import { db } from "@/firebase/firebase.config";
import { IListing, category } from "@/types";
import formatTimestamp from "@/utils/formatTimestamp";
import {
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
type CategoryData = {
  id: string;
  data: IListing;
};



function CategoryPage() {
  const [fetchedListings, setFetchedListings] = useState<CategoryData[] >([]);
  const [lastListing, setLastListing] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [loading, setLoading] = useState(false);
const router = useRouter();
    useEffect(()=>{
      async function getListings() {
        setLoading(true)
        try {
          const docRef = collection(db, "listings");

      //firestore query
      const q = query(
        docRef,
        where("type", "==", router.query.categoryname),
        orderBy("timestamp", "desc"),
        limit(5)
      );
      // fetch data from firebase.
      const docSnap = await getDocs(q);
      const listings: CategoryData[] = [];
      const lastVisible = docSnap.docs[docSnap.docs.length - 1];
      docSnap.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        let timestampString: string = formatTimestamp(doc.data() as IListing);
        listings.push({
          id: doc.id,
          data: {
            ...(doc.data() as IListing),
            timestamp: timestampString,
          },
        });
      });
      setFetchedListings(listings);
      setLastListing(lastVisible);
        }catch(err){

        }finally{
          setLoading(false)
        }
      }
      getListings()
    }, [router.query.categoryname])
   if(loading)
  {
    return <Spinner/>;
  }
  return (
    <>
      <Head>
        <title>
          Find Homes for{" "}
          {router.query.categoryname === "rent" ? "Rent" : "Sale"}
        </title>
      </Head>
      <section className="min-h-screen px-[5%] py-6 bg-primary-grey space-y-6 text-primary-black  ">
        <div>
          <h1>
            Places for {router.query.categoryname === "rent" ? "rent" : "sale"}
          </h1>
        </div>
        {/* Listing item come here */}
        <div className="flex flex-col gap-5">
          {fetchedListings.length ? (
            fetchedListings.map(({ data, id }) => (
              <ListingItem
                bathrooms={data.bathrooms}
                bedrooms={data.bedrooms}
                id={id}
                imgUrls={data.imgUrls}
                location={data.location}
                name={data.name}
                offer={data.offer}
                regularPrice={data.regularPrice}
                type={data.type}
                discountedPrice={data?.discountedPrice}
                key={id}
              />
            ))
          ) : (
            <p>
              There are currently no listings for {router.query.categoryname}
            </p>
          )}
        </div>
        {/* Load more button comes here */}

        {lastListing && (
          <LoadMore
            setLastListing={setLastListing}
            lastItem={
              lastListing
            } /* the last item to begin client data fetching gotten from the parent component. */
            setNewListings={
              setFetchedListings
            } /* sets the state of client fetched listings for the parent componet. */
            field={
              router.query.categoryname as category
            } /* offers | rent | sale */
          />
        )}
      </section>
    </>
  );
}
CategoryPage.getLayout = function getLayout(page: JSX.Element) {
  return <AuthLayout>{page}</AuthLayout>;
};
export default CategoryPage;
