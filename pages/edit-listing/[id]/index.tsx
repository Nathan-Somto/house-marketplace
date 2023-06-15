import { category, geoLocation, IListing } from "@/types";
import {
  ChangeEvent,
  useState,
  MouseEvent,
  MouseEventHandler,
  ChangeEventHandler,
  FormEvent,
  useEffect,
  useRef,
} from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadString,
} from "firebase/storage";
import { toast } from "react-toastify";
import { getDoc, doc, updateDoc, AddPrefixToKeys } from "firebase/firestore";
import { db } from "@/firebase/firebase.config";
import useAuthStore from "@/store/useAuthStore";
import { useRouter } from "next/router";
import Spinner from "@/components/Spinner";
import AuthLayout from "@/components/AuthLayout";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import PreviewImage from "@/components/PreviewImage";
import formatTimestamp from "@/utils/formatTimestamp";
type notFound = {
  notFound: boolean;
};
export const getServerSideProps: GetServerSideProps<
  { listing: IListing } | notFound
> = async (context) => {
  try {
    const { id } = context.params as ParsedUrlQuery;
    const docRef = doc(db, "listings", id as string);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      let timestampString: string = formatTimestamp(docSnap.data() as IListing);
      return {
        props: {
          listing:  {
            ...(docSnap.data() as IListing),
            timestamp: timestampString
          },
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
  images: string[];
  discountedPrice: number;
};
function EditListingPage({ listing }: { listing: IListing }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const imageInput = useRef<HTMLInputElement | null>(null);
  const oldCity = useRef<string>("");
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
  const [loading, setLoading] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<number>(-1);
  // check if it is the user listing
  // not the logged in users listings then redirect
  // prefill the form with data in the firebase.
  useEffect(() => {
    if (listing?.userRef !== user?.uid) {
      toast.error(`you cannot edit ${listing.name} as it not yours`);
      setTimeout(() => router.push("/explore"), 3000);
    } else {
      setFormData((prevState) => ({ ...prevState, ...listing }));
    }
  }, [listing, user]);
  // kick user out if not logged in.
  useEffect(() => {
    if (user === null) {
      router.push("/signin");
    }
  }, [user]);
  // keep the name of the old city.
  useEffect(() => {
    if (listing.city) {
      oldCity.current = listing.city;
    }
  }, []);
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
      if (formData.city === "") {
        throw new Error("the city cannot be empty.");
      }
      // no need to geocode if it is the old city.
      if (formData.city !== oldCity.current) {
        const res = await fetch(
          `http://api.openweathermap.org/geo/1.0/direct?q=${formData.city}&limit=1&appid=${process.env.NEXT_PUBLIC_GEOCODE_KEY}`
        );
        const data = await res.json();
        if (data !== null && data.length > 0) {
          geoLocation.lat = data[0].lat.toString() ?? formData.geoLocation.lat;
          geoLocation.lng = data[0].lon.toString() ?? formData.geoLocation.lng;
        }
        console.log(formData);
      }
      else{
        geoLocation = {...formData.geoLocation}
      }
      // loops only through the new images added.
      // loops through all images in our array , stores them in firebase and gets the uploaded url to store in firestore.
      const imgUrls = await Promise.all(
        formData.images.map(async (image) => {
          try {
            const imgUrl = await storeImage(image);
            return imgUrl;
          } catch (err) {
            toast.error("could not upload images.");
          }
        })
      );

      const updatedListingData: IListing & { images: undefined } = {
        ...formData,
        imgUrls: [...formData.imgUrls, ...(imgUrls as string[])],
        geoLocation,
        images: undefined,
      };
      delete updatedListingData.images;

      const docRef = doc(db, "listings", router.query.id as string);
      const updatedDoc = await updateDoc(
        docRef,
        updatedListingData as unknown as { [x: string]: any } & AddPrefixToKeys<
          string,
          any
        >
      );
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
  // function to store image in firebase
  async function storeImage(image: string) {
    const storage = getStorage();
    // put the actual user id important
    const fileName = `${formData.userRef}-${new Date().getTime()}`;
    const storageRef = ref(storage, fileName);
    try {
      const snapShot = await uploadString(storageRef, image, "data_url");
      const downloadUrl = await getDownloadURL(snapShot.ref);
      return downloadUrl;
    } catch (err) {
      throw new Error();
    }
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
      const { files } = e.target as files;
      if (files.length === 0) {
        return;
      }

      // instantiate a new FileReader object
      const fileReader = new FileReader();
      fileReader.onload = function (fileReaderEvt) {
        // push our new file to the images array.
        setFormData((prevState) => ({
          ...prevState,
          images: [...prevState.images, fileReaderEvt.target?.result as string],
        }));
      };
      fileReader.readAsDataURL(files[0]);
      return;
    }
    // for Booleans, Strings and Numbers.
    setFormData((prevState) => ({
      ...prevState,
      [id]: bool ?? value,
    }));
  }
  function handleImagePreview(e: MouseEvent<HTMLButtonElement>) {
    if (imageInput.current !== null) {
      imageInput.current.click();
    }
  }
  // handleDelete function
  /**
   *
   * @param index
   * @returns
   * @todo implement deletion from firebase storage.
   */
  let deletingInProgress = false;
  async function handleDelete(index: number) {
   
    if(deletingInProgress) return;
    try {
      deletingInProgress = true;
      setDeleting(index);
      let imgUrlsCopy = [...formData.imgUrls];
      imgUrlsCopy.splice(index, 1);
      // delete image in firestore.
      const updatedDoc = await updateDoc(
        doc(db, "listings", router.query.id as string),
        {
          imgUrls: imgUrlsCopy,
        }
      );
      // delete image in firebase storage

      //update the ui.

      setFormData((prevState) => ({
        ...prevState,
        imgUrls: [...imgUrlsCopy],
      }));
      toast.success("Successfully deleted image");
    } catch (err) {
      toast.error("Failed to delete image");
    } finally {
      setDeleting(-1);
    }
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
              value={formData.location}
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
            {/* Image preview */}
            {/* Selected Images from file system. */}
            {formData.imgUrls.length > 0 || formData.images.length > 0 ? (
              <div className="flex flex-col space-y-4">
                <h3>Image Preview</h3>
                <div className="flex gap-[15px] items-center justify-center flex-wrap mb-5">
                  {formData.imgUrls.map((src, index) => (
                    <PreviewImage
                      deleting={deleting}
                      onDelete={handleDelete}
                      index={index}
                      src={src}
                      alt={`image-${index + 1}`}
                      key={`${src}-${index + 1}`}
                    />
                  ))}
                  {formData.images.map((src, index) => (
                    <PreviewImage
                      src={src}
                      alt={`image-${index + 1}`}
                      key={`${src}-${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            ) : null}
            {/* Camera Icon */}
            <button
              type="button"
              disabled={formData.images.length + formData.imgUrls.length === 6}
              onClick={handleImagePreview}
              className="disabled:opacity-50 hover:scale-110 ease-out duration-300 transition-all mb-2 disabled:cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#00cc66"
                height="50px"
                width="50px"
                version="1.1"
                id="Layer_1"
                viewBox="0 0 512 512"
              >
                <g>
                  <g>
                    <g>
                      <path d="M457.188,106.847h-91.651l-18.672-44.496c-3.015-7.183-10.045-11.858-17.835-11.858H182.971     c-7.789,0-14.821,4.674-17.835,11.858l-18.672,44.496h-17.532V81.991c0-10.682-8.66-19.341-19.341-19.341H54.812     c-10.682,0-19.341,8.66-19.341,19.341v28.391C14.765,118.217,0,138.242,0,161.659v245.035c0,30.223,24.589,54.812,54.812,54.812     h402.376c30.224,0,54.812-24.589,54.812-54.812V161.659C512,131.435,487.411,106.847,457.188,106.847z M195.83,89.177h120.341     l7.414,17.67H188.415L195.83,89.177z M74.154,101.332h16.093v5.514H74.154V101.332z M473.317,406.694L473.317,406.694     c0,8.893-7.236,16.129-16.129,16.129H54.812c-8.893,0-16.129-7.236-16.129-16.129V161.659c0-8.893,7.236-16.129,16.129-16.129     c6.742,0,399.507,0,402.376,0c8.893,0,16.129,7.236,16.129,16.129V406.694z" />
                      <path d="M256,147.78c-75.21,0-136.395,61.187-136.395,136.395c0,75.21,61.187,136.396,136.395,136.396     s136.395-61.187,136.395-136.396S331.21,147.78,256,147.78z M256,381.889c-53.88,0-97.713-43.834-97.713-97.713     c0-53.88,43.834-97.713,97.713-97.713s97.713,43.834,97.713,97.713C353.713,338.055,309.88,381.889,256,381.889z" />
                      <path d="M256,217.892c-36.55,0-66.284,29.735-66.284,66.284c0,36.55,29.735,66.284,66.284,66.284s66.284-29.735,66.284-66.284     C322.284,247.626,292.55,217.892,256,217.892z M256,311.778c-15.219,0-27.601-12.382-27.601-27.602     c0-15.219,12.382-27.601,27.601-27.601c15.219,0,27.601,12.381,27.601,27.601C283.601,299.396,271.219,311.778,256,311.778z" />
                    </g>
                  </g>
                </g>
              </svg>
            </button>
            <p className={"text-sm opacity-70 mb-2"}>
              The first image will be the cover (max 6)
            </p>
            <label htmlFor="images" className="font-semibold mb-3 block">
              Upload Images
            </label>
            <input
              ref={imageInput}
              type="file"
              name="images"
              max={6}
              accept=".jpeg,.png, .jpg, .webp"
              multiple
              required
              onChange={onMutate}
              id="images"
              hidden={true}
              className="listing-input-file hidden py-[0.9rem] px-[0.7rem] listing-input listing-button w-full"
            />
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
