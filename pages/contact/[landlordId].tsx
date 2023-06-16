import AuthLayout from "@/components/AuthLayout";
import { db } from "@/firebase/firebase.config";
import { IUser } from "@/types";
import { doc, getDoc } from "firebase/firestore";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";
type userData = {
  data: IUser;
};
type user = userData | null;
export const getServerSideProps: GetServerSideProps<{ user: user } | {notFound:boolean}> = async (
  context
) => {
  try{  
  const { landlordId } = context.params as ParsedUrlQuery;
  const docRef = doc(db, "users", landlordId as string);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    throw new Error("no user");
  }
  let user = {
    data: docSnap.data() as IUser,
  };
  return {
    props: {
      user,
    },
  };
  }
  catch(err){
    return {
      notFound:true
    }
  }
};
function ContactPage({ user }: { user: user }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState<IUser | null>(null);
  const { listingName } = router.query;

  useEffect(() => {
    if (user === null) {
      router.push("/explore");
    } else {
      setUserData({ ...user.data });
    }
  }, [user,router]);
  function sendMail() {
    if (userData === null) return;
    window.open(
      `mailto:${userData.email}?Subject=${listingName}?body=${message}`
    );
  }

  return (
    <section className="pt-8 px-12 bg-primary-grey text-primary-black min-h-screen">
      <header className="mb-6">
        <h1>Contact Landlord </h1>
      </header>
      <div>
        <p className="font-medium">
          Contact {userData?.firstName} about{" "}
          <span className="opacity-70 underline">{listingName}</span>
        </p>{" "}
        {/* Landlord name */}
        <form className="mt-8">
          <div className=" flex flex-col mb-8 ">
            <label
              htmlFor="message"
              className="mb-4 ml-2 font-bold text-[1.2rem]"
            >
              Message
            </label>
            <div className="relative md:w-[80%] max-w-[600px]">
              <textarea
                name="message"
                className="rounded-[1.5rem] focus:border-2 active:border-2 w-full border-gray-400  resize-none h-[20rem] shadow-[0_2px_5px_rgba(50,50,50,0.25)] outline-none p-4"
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
              <span className="absolute bottom-[20px] right-[20px]  opacity-70 ">
                {message.length}
              </span>
            </div>
          </div>
          <button
            onClick={sendMail}
            type="button"
            className="primary-btn ml-2 ease-in transition-all duration-300 hover:opacity-80"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
ContactPage.getLayout = function getLayout(page: JSX.Element) {
  return <AuthLayout>{page}</AuthLayout>;
};
export default ContactPage;
