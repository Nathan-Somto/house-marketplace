import AuthLayout from "@/components/AuthLayout";
import CategoryLink from "@/components/CategoryLink";
import { category } from "@/types";
import React from "react";
type Categories = {
  category: category;
  src: string;
  id: number;
};
function ExplorePage() {
  const categories: Categories[] = [
    { category: "rent", src: "/jpg/rentCategoryImage.jpg", id: 1 },
    { category: "sale", src: "/jpg/sellCategoryImage.jpg", id: 2 },
  ];
  return (
    <section className="px-12 md:px-8 lg:px-2 min-h-screen py-[5%] space-y-12 bg-primary-grey">
      <div className="flex md:items-center lg:w-[80%] mx-auto space-y-6 flex-col md:flex-row md:space-y-0 md:justify-between">
        <h1>Explore</h1>
        <form className="flex space-x-1">
          <button
            type="button"
            className="h-[40px] hover:opacity-50 w-[40px] flex-shrink-0 flex items-center justify-center rounded-md  bg-primary-green shadow-[0px_0px_20px_rgba(0,255,0,0.32)]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 50 50"
              width="25px"
              height="25px"
              fill="#fff"
            >
              <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z" />
            </svg>
          </button>
          <input
            type="text"
            placeholder="Search"
            id="search"
            name="search"
            className="rounded-md py-2 px-5 h-[40px]  bg-primary-white shadow-[0px_0px_5px_rgba(0,0,0,0.2)]"
          />
        </form>
      </div>
      <div>

      <h3 className="lg:w-[80%] mx-auto mb-5 opacity-80">Latest</h3>
      <div className="h-[300px] bg-[rgba(0,0,0,0.5)] rounded-xl lg:w-[80%] mx-auto "></div>
      </div>
      <div>
      <h3 className="lg:w-[80%] mx-auto mb-5 opacity-80">Categories</h3>
      <div className="flex items-center space-x-[5%]  lg:space-x-[10%] lg:w-[80%] mx-auto ">
        {categories.map((category) => (
          <CategoryLink
            key={category.id}
            src={category.src}
            category={category.category}
          />
        ))}
      </div>
      </div>
    </section>
  );
}

ExplorePage.getLayout = function getLayout(page: JSX.Element) {
  return <AuthLayout>{page}</AuthLayout>;
};
export default ExplorePage;
