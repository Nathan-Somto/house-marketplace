import AuthLayout from "@/components/AuthLayout";
import ListingItem from "@/components/ListingItem";
import { db } from "@/firebase/firebase.config";
import { IListing } from "@/types";
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
        timestamp: (doc.data().timestamp as Timestamp).toString(),
      },
    })
  );
  return { props: { listings } };
};
function CategoryPage({ listings }: CategoryPageProps) {
  const [lastListing, setLastListing] = useState<CategoryData | null>(null);
  const router = useRouter();
  useEffect(() => {
    if (listings.length !== 0) {
      setLastListing(listings[listings.length - 1]);
    }
  }, [listings]);

  return (
    <section className="min-h-screen px-[5%] py-6 bg-primary-grey space-y-6 text-primary-black  ">
      <div>
        <h1>
          Places for {router.query.categoryname === "rent" ? "rent" : "sale"}
        </h1>
      </div>
      {/* Listing item come here */}
      <div className="space-y-4">
        {listings.length ? (
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
          <p>There are currently no listings for {router.query.categoryname}</p>
        )}
      </div>
      {/* Load more button comes here */}
      {/* 
            <LoadMore 
            lastItem={} the last item to begin client data fetching gotten from the parent component.
            setLast={} sets the last item for the parent component
            setNewListings={} sets the state of client fetched listings for the parent componet.
            field={} offers | rent | sale
            />
         */}
    </section>
  );
}
CategoryPage.getLayout = function getLayout(page: JSX.Element) {
  return <AuthLayout>{page}</AuthLayout>;
};
export default CategoryPage;
