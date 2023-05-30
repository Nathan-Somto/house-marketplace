import "@/styles/globals.css";
import { NextPage } from "next";
import { AppProps } from "next/app";
import { Montserrat } from "next/font/google";
import { ReactElement, ReactNode } from "react";
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
export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page: JSX.Element) => page);
  return (
    <div className={montserrat.className}>
      {getLayout(<Component {...pageProps} />)}
    </div>
  );
}
