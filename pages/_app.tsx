import "@/styles/globals.css";
import 'react-toastify/dist/ReactToastify.css';
import { NextPage } from "next";
import { AppProps } from "next/app";
import { Montserrat } from "next/font/google";
import { ReactElement, ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import { AnimatePresence } from "framer-motion";
const montserrat = Montserrat({
  weight: ["400", "700", "600", "500"],
  style: ["normal"],
  subsets: ["latin"],
  fallback: ["serif"],
});
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
export default function App({ Component, pageProps,router }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page: JSX.Element) => page);
  return (
    <AnimatePresence mode='wait' >
    <div className={montserrat.className}>
      {getLayout(<Component {...pageProps} key={router.asPath} />)}
      <ToastContainer
      className={'rounded-4xl'}
      theme='dark'
      position="top-right"
      />
    </div>
    </AnimatePresence>
  );
}
