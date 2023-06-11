import AuthLayout from "@/components/AuthLayout";
import ListingItem from "@/components/ListingItem";
import LoadMore from "@/components/LoadMore";
import { db } from "@/firebase/firebase.config";
import { IListing, category } from "@/types";
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
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";
type CategoryData = {
  id: string;
  data: IListing;
};
type notFound = {
  notFound: boolean;
};
type CategoryPageProps = {
  listings: CategoryData[];
};
export const getServerSideProps: GetServerSideProps<
  { listings: CategoryData[] } | notFound
> = async (context) => {
  const { categoryname } = context.params as ParsedUrlQuery;
  if (categoryname !== "rent" && categoryname !== "sale") {
    return {
      notFound: true,
    };
  }

  // get our firestore collection
  const docRef = collection(db, "listings");

  //firestore query
  const q = query(
    docRef,
    where("type", "==", categoryname),
    orderBy("timestamp", "desc"),
    limit(5)
  );
  // fetch data from firebase.
  const docSnap = await getDocs(q);
  const listings: CategoryData[] = [];

  docSnap.forEach((doc: QueryDocumentSnapshot<DocumentData>) =>
    listings.push({
      id: doc.id,
      data: {
        ...(doc.data() as IListing),
        
      },
    })
  );
  return { props: { listings } };
};
function CategoryPage({ listings }: CategoryPageProps) {
  const [lastListing, setLastListing] = useState<CategoryData | null>(null);
  const [fetchedListings, setFetchedListings] = useState(listings);
  const router = useRouter();
  useEffect(() => {
    if (fetchedListings.length !== 0) {
      setLastListing(fetchedListings[fetchedListings.length - 1]);
    }
  }, [fetchedListings]);

  return (
    <section className="min-h-screen px-[5%] py-6 bg-primary-grey space-y-6 text-primary-black  ">
      <div>
        <h1>
          Places for {router.query.categoryname === "rent" ? "rent" : "sale"}
        </h1>
      </div>
      {/* Listing item come here */}
      <div className="space-y-4">
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
          <p>There are currently no listings for {router.query.categoryname}</p>
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
          field={
            router.query.categoryname as category
          } /* offers | rent | sale */
        />
      )}
    </section>
  );
}
CategoryPage.getLayout = function getLayout(page: JSX.Element) {
  return <AuthLayout>{page}</AuthLayout>;
};
export default CategoryPage;
