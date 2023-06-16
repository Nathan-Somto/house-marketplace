import { db } from "@/firebase/firebase.config";
import { IListing } from "@/types";
import formatTimestamp from "@/utils/formatTimestamp";
import { DocumentData, QueryDocumentSnapshot, Timestamp, collection, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";

type LoadData = {
    id: string;
    data: IListing;
  };
type field = "offer"| "rent"| "sale"
type props={
    lastItem:LoadData;
    setNewListings:Dispatch<SetStateAction<LoadData[]>>;
    field:field;
}

function LoadMore({lastItem, setNewListings, field}:props):JSX.Element{
  const [loading, setLoading] = useState(false);
  async function handleLoadMore() {
        setLoading(true);
    try {
        const docRef = collection(db, "listings");
        let whereField = field === "offer" ? field : "type";
        let clientField = field === "offer" ? true : field === "rent" ? field : "sale";
       
  //firestore query
  const q = query(
    docRef,
    where(whereField, "==", clientField),
    orderBy("timestamp", "desc"),
    startAfter(lastItem),
    limit(5)
  );
  // fetch data from firebase.
  const docSnap = await getDocs(q);
  const listings: LoadData[] = [];

  
  docSnap.forEach((doc: QueryDocumentSnapshot<DocumentData>) =>{
  let timestampString: string = formatTimestamp(doc.data() as IListing);
  listings.push({
    id: doc.id,
    data: {
      ...(doc.data() as IListing),
      timestamp: timestampString,
    },
  })
  }
);
  console.log(listings)
    setNewListings(prevState=>([...prevState, ...listings]));
    } catch (err) {
        toast.error("Could not fetch more listings.");
    }
    finally{
        setLoading(false);
    }
  }

  return (
    <button disabled={loading} onClick={handleLoadMore} className="w-[8rem] mx-auto my-0 text-center py-1 px-2 flex items-center justify-center opacity-70 mt-8 bg-primary-black text-primary-white font-bold rounded-2xl">
      {!loading ? (
        <span>Load More</span>
      ) : (
        <span
          className="h-6
         w-6 
         border-t-transparent 
         block border-solid 
         border rounded-[50%]
          border-primary-white
           animate-spin"
        ></span>
      )}
    </button>
  );
}

export default LoadMore;
