import AuthLayout from '@/components/AuthLayout'
import ListingItem from '@/components/ListingItem';
import { db } from '@/firebase/firebase.config';
import { IListing } from '@/types';
import { DocumentData, QueryDocumentSnapshot, Timestamp, collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react'

type OffersData = {
  id: string;
  data: IListing;
};

type OffersPageProps = {
  listings: OffersData[];
};
export const getServerSideProps: GetServerSideProps<
  { listings: OffersData[] }
> = async () => {
  
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
  try{
  const docSnap = await getDocs(q);

  docSnap.forEach((doc: QueryDocumentSnapshot<DocumentData>) =>
    listings.push({
      id: doc.id,
      data: {
        ...(doc.data() as IListing),
        timestamp: (doc.data().timestamp as Timestamp).toString(),
      },
    })
  );
  }
  catch(err){
    console.log(err);
  }
  return { props: { listings } };
};
function OffersPage({listings}:OffersPageProps) {
  const [lastListing, setLastListing] = useState<OffersData | null>(null);
  useEffect(() => {
    if (listings.length !== 0) {
      setLastListing(listings[listings.length - 1]);
    }
  }, [listings]);
  console.log(listings)
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
    </section>
  )
}
OffersPage.getLayout = function getLayout(page:JSX.Element) {
    return (
      <AuthLayout>
        {page}
      </AuthLayout>
    )
  }
export default OffersPage