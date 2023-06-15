import AuthLayout from "@/components/AuthLayout";
import ListingItem from "@/components/ListingItem";
import LoadMore from "@/components/LoadMore";
import { db } from "@/firebase/firebase.config";
import { IListing } from "@/types";
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
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

type OffersData = {
  id: string;
  data: IListing;
};

type OffersPageProps = {
  listings: OffersData[];
};
export const getServerSideProps: GetServerSideProps<{
  listings: OffersData[];
}> = async () => {
  // get our firestore collection
  const docRef = collection(db, "listings");

  //firestore query
  const q = query(
    docRef,
    where("offer", "==", true),
    orderBy("timestamp", "desc"),
    limit(5)
  );
  // fetch data from firebase.
  const listings: OffersData[] = [];
  try {
    const docSnap = await getDocs(q);

    docSnap.forEach((doc: QueryDocumentSnapshot<DocumentData>) =>{
      let timestampString: string = formatTimestamp(doc.data() as IListing);
      listings.push({
        id: doc.id,
        data: {
          ...(doc.data() as IListing),
          timestamp: timestampString
        },
      })
      }
    );
  } catch (err) {
    console.log(err);
  }
  return { props: { listings } };
};
function OffersPage({ listings }: OffersPageProps) {
  const [lastListing, setLastListing] = useState<OffersData | null>(null);
  const [fetchedListings, setFetchedListings] = useState(listings);
  useEffect(() => {
    if (fetchedListings.length !== 0) {
      setLastListing(fetchedListings[fetchedListings.length - 1]);
    }
  }, [fetchedListings]);
  return (
    <section className="min-h-screen px-[5%] py-6 bg-primary-grey space-y-6 text-primary-black  ">
      <h1>Offers</h1>
      {/* Listing item come here */}
      <div className="space-y-4">
        {listings.length !== 0 ? (
          listings.map(({ data, id }) => (
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
          lastItem={
            lastListing
          } /* the last item to begin client data fetching gotten from the parent component. */
          setNewListings={
            setFetchedListings
          } /* sets the state of client fetched listings for the parent componet. */
          field={"offers"} /* offers | rent | sale */
        />
      )}
    </section>
  );
}
OffersPage.getLayout = function getLayout(page: JSX.Element) {
  return <AuthLayout>{page}</AuthLayout>;
};
export default OffersPage;
