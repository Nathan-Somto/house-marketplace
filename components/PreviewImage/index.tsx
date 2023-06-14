import React from "react";

type Props = {
  src: string;
  alt: string;
  onDelete?: (index: number) => Promise<void>;
  index?: number;
  deleting?: number;
};

export default function PreviewImage({
  src,
  alt,
  onDelete,
  index,
  deleting,
}: Props) {
  return (
    <figure className="relative overflow-hidden rounded-md h-[300px] w-[300px]">
      {/* Image */}
      <img src={src} alt={alt} className="h-full w-full object-cover" />
      {/* Delete icon */}
      {onDelete !== undefined && index !== undefined && (
        <button
          type="button"
          className="absolute top-[10px] z-[2] right-[10px] hover:opacity-50"
          onClick={() => onDelete(index)}
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
      {/* Deleting loader */}
      {typeof deleting !== "undefined" &&
        typeof index !== "undefined" &&
        deleting === index && (
          <div className="absolute top-0 h-full w-full backdrop-blur-md grid place-items-center z-[3]">
            <p className="text-[rgb(226,27,12)] font-semibold"> Deleting...</p>
          </div>
        )}
    </figure>
  );
}
