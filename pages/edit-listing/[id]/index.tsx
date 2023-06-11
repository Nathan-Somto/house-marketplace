import { category, geoLocation, IListing } from "@/types";
import {
  ChangeEvent,
  useState,
  MouseEvent,
  MouseEventHandler,
  ChangeEventHandler,
  FormEvent,
  useEffect,
} from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { toast } from "react-toastify";
import { getDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase.config";
import useAuthStore from "@/store/useAuthStore";
import { useRouter } from "next/router";
import Spinner from "@/components/Spinner";
import AuthLayout from "@/components/AuthLayout";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
type notFound = {
  notFound: boolean;
};
const getServerSideProps: GetServerSideProps<
  { listing: IListing } | notFound
> = async (context) => {
  try {
    const { id } = context.params as ParsedUrlQuery;
    const docRef = doc(db, "listings", id as string);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        props: {
          listing: docSnap.data() as IListing,
        },
      };
    }
    throw new Error("listing was not found");
  } catch (err) {
    return {
      notFound: true,
    };
  }
};
type files = { files: FileList };
type formData = IListing & {
  city: string;
  images: File[];
  discountedPrice: number;
};
function EditListingPage({ listing }: { listing: IListing }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [formData, setFormData] = useState<formData>({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: true,
    location: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    city: "",
    userRef: "",
    images: [],
    geoLocation: {
      lat: "0",
      lng: "0",
    },
    imgUrls: [],
    timestamp: "",
  });
  const [loading, setLoading] = useState(false);
  // check if it is the user listing 
  // not the logged in users listings then redirect
  // prefill the form with data in the firebase.
  useEffect(() => {
    if (listing.userRef !== user?.uid) {
      toast.error(`you cannot edit ${listing.name} as it not yours`);
      setTimeout(() => router.push("/explore"), 3000);
    } else {
      setFormData((prevState) => ({ ...prevState, ...listing }));
    }
  }, [listing,user]);
  // kick user out if not logged in.
  useEffect(() => {
    if (user === null) {
      router.push("/signin");
    }
  }, [user]);
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (formData.discountedPrice >= formData.regularPrice) {
      toast.error("Discounted price cannot be greater than regular price.");
      return;
    }
    if (formData.images.length > 6) {
      toast.error("You can only upload a maximium of 6 images.");
      return;
    }
    setLoading(true);
    try {
      let geoLocation: geoLocation = { lat: "0", lng: "0" };

      if (formData.city !== "") {
        const res = await fetch(
          `http://api.openweathermap.org/geo/1.0/direct?q=${formData.city}&limit=1&appid=${process.env.NEXT_PUBLIC_GEOCODE_KEY}`
        );
        const data = await res.json();
        if (data !== null && data.length > 0) {
          geoLocation.lat = data[0].lat.toString() ?? formData.geoLocation.lat;
          geoLocation.lng = data[0].lng.toString() ?? formData.geoLocation.lng;
        }
        console.log(formData);
      } else {
        throw new Error("the city cannot be empty.");
      }

      const imgUrls = await Promise.all(
        formData.images.map((image) => storeImage(image))
      ).catch(() => toast.error("failed to upload images."));

      const updatedListingData: IListing & { images: undefined } = {
        ...formData,
        imgUrls: imgUrls as string[],
        geoLocation,
        images: undefined,
      };
      delete updatedListingData.images;

      const docRef = doc(db, "listings", router.query.id as string);
      const updatedDoc = await updateDoc(docRef, updatedListingData);
      toast.success("Successfully updated Listing.");
      router.push(`/category/${formData.type}/${router.query.id}`);
    } catch (err) {
      let message = "there was an error while creating the listing.";
      if (err instanceof Error) message = err.message;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }
  async function storeImage(image: File) {
    return new Promise((resolve, reject) => {
      const storage = getStorage();
      const fileName = `userId-${image.name}-${new Date().getTime()}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  }
  function onMutate(
    e: MouseEvent<HTMLButtonElement> | ChangeEvent<HTMLInputElement>
  ) {
    const target = e.target as HTMLInputElement | HTMLButtonElement;
    const { value, id, type } = target;
    let bool: boolean | null = null;
    // for the Boolean fields
    if (type === "button") {
      if (value === "true") {
        bool = true;
      }
      if (value === "false") {
        bool = false;
      }
    }
    // for the files field.
    if (type === "file") {
      if ((e.target as files).files) {
        // converts fileList from an Array like Object to an  array.
        const fileList = Array.from((e.target as files).files);
        // push our new file to the images array.
        setFormData((prevState) => ({
          ...prevState,
          images: [...formData.images, ...fileList],
        }));
        return;
      }
    }
    // for Booleans, Strings and Numbers.
    setFormData((prevState) => ({
      ...prevState,
      [id]: bool ?? value,
    }));
  }
  return (
    <>
      <section className="bg-primary-grey py-8  relative text-primary-black px-[5%]">
        <header className="mb-6 ">
          <h1 className="lg:text-4xl">Edit Listing</h1>
        </header>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="type" className="font-semibold mb-3 block">
              Sell / Rent
            </label>
            <div className="space-x-5 flex items-center">
              <button
                type={"button"}
                value={"sale"}
                id={"type"}
                onClick={
                  onMutate as unknown as MouseEventHandler<HTMLButtonElement>
                }
                className={`listing-button ${
                  formData.type === "sale" ? "listing-button-active" : ""
                }`}
              >
                Sell
              </button>
              <button
                type={"button"}
                value={"rent"}
                id={"type"}
                onClick={
                  onMutate as unknown as MouseEventHandler<HTMLButtonElement>
                }
                className={`listing-button ${
                  formData.type === "rent" ? "listing-button-active" : ""
                }`}
              >
                Rent
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="name" className="font-semibold mb-3 block">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              id={"name"}
              name={"name"}
              onChange={onMutate}
              minLength={8}
              maxLength={32}
              className="input-box max-w-[320px]"
              required
            />
          </div>
          <div className="space-x-8 flex items-center">
            <div>
              <label htmlFor="bedrooms" className="font-semibold mb-3 block">
                Bedrooms
              </label>
              <input
                type="number"
                name="bedrooms"
                id="bedrooms"
                onChange={onMutate}
                value={formData.bedrooms}
                minLength={1}
                maxLength={50}
                className="listing-button py-[0.9rem] px-[0.7rem] listing-input max-w-[70px] text-center"
              />
            </div>
            <div>
              <label htmlFor="bathrooms" className="font-semibold mb-3 block">
                Bathrooms
              </label>
              <input
                type="number"
                name="bathrooms"
                id="bathrooms"
                onChange={onMutate}
                value={formData.bathrooms}
                minLength={1}
                maxLength={50}
                className="listing-button py-[0.9rem] px-[0.7rem] listing-input max-w-[70px] text-center"
              />
            </div>
          </div>
          <div>
            <label htmlFor="type" className="font-semibold mb-3 block">
              Parking spot
            </label>
            <div className="space-x-5 flex items-center">
              <button
                type={"button"}
                value={"true"}
                id={"parking"}
                onClick={
                  onMutate as unknown as MouseEventHandler<HTMLButtonElement>
                }
                className={`listing-button ${
                  formData.parking ? "listing-button-active" : ""
                }`}
              >
                Yes
              </button>
              <button
                type={"button"}
                value={"false"}
                id={"parking"}
                onClick={
                  onMutate as unknown as MouseEventHandler<HTMLButtonElement>
                }
                className={`listing-button ${
                  !formData.parking ? "listing-button-active" : ""
                }`}
              >
                No
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="type" className="font-semibold mb-3 block">
              Furnished
            </label>
            <div className="space-x-5 flex items-center">
              <button
                type={"button"}
                value={"true"}
                id={"furnished"}
                onClick={
                  onMutate as unknown as MouseEventHandler<HTMLButtonElement>
                }
                className={`listing-button ${
                  formData.furnished ? "listing-button-active" : ""
                }`}
              >
                Yes
              </button>
              <button
                type={"button"}
                value={"false"}
                id={"furnished"}
                onClick={
                  onMutate as unknown as MouseEventHandler<HTMLButtonElement>
                }
                className={`listing-button ${
                  !formData.furnished ? "listing-button-active" : ""
                }`}
              >
                No
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="location" className="font-semibold mb-3 block">
              Address
            </label>
            <textarea
              name="location"
              id="location"
              cols={35}
              rows={5}
              className="resize-none input-box max-w-[320px] px-2"
              onChange={
                onMutate as unknown as ChangeEventHandler<HTMLTextAreaElement>
              }
            ></textarea>
          </div>
          <div>
            <label htmlFor="city" className="font-semibold mb-3 block">
              City
            </label>
            <input
              type="text"
              value={formData.city}
              id={"city"}
              name={"city"}
              onChange={onMutate}
              minLength={8}
              maxLength={32}
              className="input-box max-w-[320px]"
              required
            />
          </div>
          <div>
            <label htmlFor="type" className="font-semibold mb-3 block">
              Offer
            </label>
            <div className="space-x-5 flex items-center">
              <button
                type={"button"}
                value={"true"}
                id={"offer"}
                onClick={
                  onMutate as unknown as MouseEventHandler<HTMLButtonElement>
                }
                className={`listing-button ${
                  formData.offer ? "listing-button-active" : ""
                }`}
              >
                Yes
              </button>
              <button
                type={"button"}
                value={"false"}
                id={"offer"}
                onClick={
                  onMutate as unknown as MouseEventHandler<HTMLButtonElement>
                }
                className={`listing-button ${
                  !formData.offer ? "listing-button-active" : ""
                }`}
              >
                No
              </button>
            </div>
            <div style={{ marginTop: "1.25rem" }}>
              <label
                htmlFor="regularPrice"
                className="font-semibold mb-3 block"
              >
                Regular Price.
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  name="regularPrice"
                  id="regularPrice"
                  value={formData.regularPrice}
                  className="listing-button max-w-[100px] py-[0.9rem] px-[0.7rem] text-center listing-input"
                  min={50}
                  max={1000000000000}
                  onChange={onMutate}
                />
                {formData.type === "rent" ? (
                  <span className="font-semibold">$ / Month</span>
                ) : (
                  ""
                )}
              </div>
            </div>
            {formData.offer ? (
              <div style={{ marginTop: "1.25rem" }}>
                <label
                  htmlFor="discountedPrice"
                  className="font-semibold mb-3 block"
                >
                  Discounted Price.
                </label>
                <input
                  type="number"
                  name="discountedPrice"
                  id="discountedPrice"
                  value={formData.discountedPrice}
                  className="listing-button max-w-[100px] py-[0.9rem] px-[0.7rem] text-center listing-input"
                  min={50}
                  max={1000000000000}
                  onChange={onMutate}
                />
              </div>
            ) : (
              ""
            )}
          </div>
          <div style={{ marginBottom: "5rem" }}>
            <label htmlFor="images" className="font-semibold mb-3 block">
              Images
            </label>
            <p className={"text-sm opacity-70 mb-2"}>
              The first image will be the cover (max 6)
            </p>
            <input
              type="file"
              name="images"
              max={6}
              accept=".jpeg,.png, .jpg, .webp"
              multiple
              required
              onChange={onMutate}
              id="images"
              className="listing-input-file py-[0.9rem] px-[0.7rem] listing-input listing-button w-full"
            />
            {formData.images.length > 0 && (
              <div className="mt-5">
                <h4 className="text-base font-bold mb-2">Selected Files:</h4>
                <ul>
                  {formData.images.map((file: File, index: number) => (
                    <li
                      key={index}
                      className="text-base text-primary-black mb-1 before:content-['\2022'] before:inline before:text-[1.02rem] before:font-bold before:mr-4 ml-5 before:text-primary-green"
                    >
                      {file.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button
            type={"submit"}
            className="primary-btn w-[80%] mx-auto hover:opacity-50 "
          >
            Edit Listing
          </button>
        </form>
      </section>
      {loading && <Spinner />}
    </>
  );
}
EditListingPage.getLayout = function getLayout(page: JSX.Element) {
  return <AuthLayout>{page}</AuthLayout>;
};
export default EditListingPage;
