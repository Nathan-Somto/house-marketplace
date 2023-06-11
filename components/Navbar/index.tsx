import Link from "next/link";
import { useRouter } from "next/router";
function NavBar() {
  const router = useRouter();
  console.log(router.pathname);
  function pathMatchRoute(route: string): boolean {
    if (route === router.pathname) return true;
    return false;
  }
  return (
    <nav className="fixed max-md:bottom-0 h-[110px] z-[900] py-5 px-3 w-full border-t border-[#cccfcc] md:border-r md:border-t-0 md:left-0  md:h-screen md:w-[250px] md:py-8 bg-primary-white">
      <h2 className="hidden md:block text-lg mb-4 px-3 py-2">
        <span>
        <svg
             className="inline mr-2"
              xmlns="http://www.w3.org/2000/svg"
              height="35px"
              viewBox="0 0 24 24"
              width="35px"
              fill={`#212121`}
            >
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
          </span><span>Marketplace</span>
      </h2>
      <ul className="flex space-x-8 items-center justify-center md:space-x-0 md:flex-col md:justify-start md:items-start md:space-y-4 w-full">
        <li className="md:hover:bg-gray-300 md:w-full md:px-3 md:rounded-md md:flex md:py-2">
          <Link
            href="/explore"
            className={`flex flex-col space-y-2 items-center justify-center md:space-x-4 md:flex-row md:space-y-0 ${
              pathMatchRoute("/explore") ? "text-gray-900" : "text-gray-500"
            }`}
          >
            <svg
              className="max-md:hover:scale-110 transition-all ease-out duration-300"
              xmlns="http://www.w3.org/2000/svg"
              height="35px"
              viewBox="0 0 24 24"
              width="35px"
              fill={`${pathMatchRoute("/explore") ? "#212121," : "#9E9E9E"}`}
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z" />
            </svg>
            <span>Explore</span>
          </Link>
        </li>
        <li className="md:hover:bg-gray-300 md:w-full md:px-3 md:rounded-md md:flex md:py-2">
          <Link
            href="/offers"
            className={`flex flex-col space-y-2 items-center justify-center md:space-x-4 md:flex-row md:space-y-0 ${
              pathMatchRoute("/offers") ? "text-gray-900" : "text-gray-500"
            }`}
          >
            <svg
              className="max-md:hover:scale-110 transition-all ease-out duration-300"
              xmlns="http://www.w3.org/2000/svg"
              height="35px"
              viewBox="0 0 24 24"
              width="35px"
              fill={`${pathMatchRoute("/offers") ? "#212121," : "#9E9E9E"}`}
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42zM13 20.01L4 11V4h7v-.01l9 9-7 7.02z" />
              <circle cx="6.5" cy="6.5" r="1.5" />
            </svg>
            <span>Offers</span>
          </Link>
        </li>
        <li className="md:hover:bg-gray-300 md:w-full md:px-3 md:rounded-md md:flex md:py-2">
          <Link
            href="/profile"
            className={`flex flex-col space-y-2 items-center justify-center md:space-x-4 md:flex-row md:space-y-0 ${
              pathMatchRoute("/profile") ? "text-gray-900" : "text-gray-500"
            }`}
          >
            <svg
              className="max-md:hover:scale-110 transition-all ease-out duration-300"
              xmlns="http://www.w3.org/2000/svg"
              height="35px"
              viewBox="0 0 24 24"
              width="35px"
              fill={`${pathMatchRoute("/profile") ? "#212121," : "#9E9E9E"}`}
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <span>Profile</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
