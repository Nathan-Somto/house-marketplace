import AuthLayout from "@/components/AuthLayout";
import ListingItem from "@/components/ListingItem";
import LoadMore from "@/components/LoadMore";
import Spinner from "@/components/Spinner";
import { db } from "@/firebase/firebase.config";
import { IListing } from "@/types";
import formatTimestamp from "@/utils/formatTimestamp";
import {
  DocumentData,
  QueryDocumentSnapshot,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";

type OffersData = {
  id: string;
  data: IListing;
};
function OffersPage() {
  const [fetchedListings, setFetchedListings] = useState<OffersData[] >([]);
  const [lastListing, setLastListing] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [loading, setLoading] = useState(false);
    useEffect(()=>{
      async function getListings() {
        setLoading(true)
        try {
          const docRef = collection(db, "listings");

      //firestore query
      const q = query(
        docRef,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        limit(5)
      );
      // fetch data from firebase.
      const docSnap = await getDocs(q);
      const listings: OffersData[] = [];
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
    }, [])
   if(loading)
  {
    return <Spinner/>;
  }
  return (
    <section className="min-h-screen px-[5%] py-6 bg-primary-grey space-y-6 text-primary-black  ">
      <h1>Offers</h1>
      {/* Listing item come here */}
      <div className="space-y-[2.5rem]">
        {fetchedListings.length !== 0 ? (
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
          <p>There are currently no listings that have offers</p>
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
          field={"offer"} /* offers | rent | sale */
        />
      )}
    </section>
  );
}
OffersPage.getLayout = function getLayout(page: JSX.Element) {
  return <AuthLayout>{page}</AuthLayout>;
};
export default OffersPage;
