import '@/styles/globals.css';
import { AppProps } from 'next/app';
import { Montserrat} from 'next/font/google';
const montserrat = Montserrat({
  weight: ['400', '700','600','500'],
  style: ['normal'],
  subsets:["latin"],
  fallback:['serif'],
 
});
export default function App({Component, pageProps}:AppProps){
  return( 
    <div className={montserrat.className}>
      <Component {...pageProps}/>
    </div> 
  );
}