import { IListing } from "@/types";
import Link from "next/link";
import Image from "next/image";
import React, { Dispatch, SetStateAction } from "react";
type props = Omit<
  IListing,
  "furnished" | "timestamp" | "parking" | "userRef" | "geoLocation"
> & {
  showDeleteModal?: Dispatch<SetStateAction<boolean>>;
  id: string;
  setSelectedListing?: Dispatch<
    SetStateAction<{
      id: string;
      name: string;
    }>
  >;
  onEdit?: (id: string) => void;
};
function ListingItem({
  bedrooms,
  discountedPrice,
  id,
  imgUrls,
  location,
  name,
  offer,
  regularPrice,
  type,
  showDeleteModal,
  setSelectedListing,
  bathrooms,
  onEdit,
}: props) {
  return (
    <Link
      href={`/category/${type}/${id}`}
      className="flex relative space-x-2 w-full items-center  h-[130px] text-black lg:h-[250px]"
    >
      <figure className="relative w-[30%] lg:w-[20%] group overflow-hidden h-[130px] lg:h-[250px] mr-5 rounded-3xl p-0">
        <Image
          fill
          alt={name}
          src={imgUrls[0]}
          className="object-cover   group-hover:scale-125 transition-all duration-200 ease-linear"
        />
      </figure>
      <div className="w-[65%] lg:w-[79%]">
        <p className="text-[0.7rem] font-semibold opacity-80 mb-0">
          {location}
        </p>
        <h3 className="font-semibold m-0 text-xl text-black">{name}</h3>
        <p className="flex flex-col mt-2 font-semibold text-lg text-primary-green mb-2">
          {offer ? (
            <span className="text-[0.7rem] line-through text-black opacity-80 ">
              ${regularPrice + (type === "rent" ? " / Month" : "")}
            </span>
          ) : (
            ""
          )}
          <span>
            ${offer ? discountedPrice : regularPrice}
            {type === "rent" ? " / Month" : ""}
          </span>
        </p>
        <div className="flex justify-between flex-wrap  max-w-[300px]">
          <p className=" text-[0.72rem] flex items-center gap-3">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                enableBackground="new 0 0 24 24"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                fill="#000000"
              >
                <g>
                  <rect fill="none" height="24" width="24" />
                </g>
                <g>
                  <g>
                    <rect fill="none" height="3" width="5" x="6" y="7" />
                    <rect fill="none" height="3" width="5" x="13" y="7" />
                    <path d="M20,10V7c0-1.1-0.9-2-2-2H6C4.9,5,4,5.9,4,7v3c-1.1,0-2,0.9-2,2v5h1.33L4,19h1l0.67-2h12.67L19,19h1l0.67-2H22v-5 C22,10.9,21.1,10,20,10z M11,10H6V7h5V10z M18,10h-5V7h5V10z" />
                  </g>
                </g>
              </svg>
            </span>
            <span>
              {bedrooms} Bedroom{bedrooms > 1 ? "s" : ""}
            </span>
          </p>
          <p className=" text-[0.72rem] flex font-medium items-center gap-3">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                enableBackground="new 0 0 24 24"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                fill="#000000"
              >
                <g>
                  <rect fill="none" height="24" width="24" />
                </g>
                <g>
                  <g>
                    <g>
                      <circle cx="7" cy="7" r="2" />
                    </g>
                    <g>
                      <path d="M20,13V4.83C20,3.27,18.73,2,17.17,2c-0.75,0-1.47,0.3-2,0.83l-1.25,1.25C13.76,4.03,13.59,4,13.41,4 c-0.4,0-0.77,0.12-1.08,0.32l2.76,2.76c0.2-0.31,0.32-0.68,0.32-1.08c0-0.18-0.03-0.34-0.07-0.51l1.25-1.25 C16.74,4.09,16.95,4,17.17,4C17.63,4,18,4.37,18,4.83V13h-6.85c-0.3-0.21-0.57-0.45-0.82-0.72l-1.4-1.55 c-0.19-0.21-0.43-0.38-0.69-0.5C7.93,10.08,7.59,10,7.24,10C6,10.01,5,11.01,5,12.25V13H2v6c0,1.1,0.9,2,2,2c0,0.55,0.45,1,1,1 h14c0.55,0,1-0.45,1-1c1.1,0,2-0.9,2-2v-6H20z" />
                    </g>
                  </g>
                </g>
              </svg>
            </span>
            <span>
              {bathrooms} Bathroom{bathrooms > 1 ? "s" : ""}
            </span>
          </p>
        </div>
      </div>
      {/* Delete Icon */}
      {showDeleteModal !== undefined && setSelectedListing !== undefined && (
        <button
          onClick={(e) => {
            e.preventDefault();
            setSelectedListing({ id, name });
            showDeleteModal(true);
          }}
          className="absolute -top-[3%]  -right-[2%]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="rgb(226,27,12)"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
          </svg>
        </button>
      )}
      {/* Edit Icon */}
      {onEdit !== undefined && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onEdit(id);
          }}
          className="absolute
        top-[1%];
        -right-[2%]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="#000000"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
        </button>
      )}
    </Link>
  );
}

export default ListingItem;
