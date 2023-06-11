import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {motion} from 'framer-motion';
function HomePage(){
    const router = useRouter();
  return (
    <>
    <header className='fixed top-0 h-24 w-full z-[2]'>
        <nav className='flex w-full justify-between px-6  items-center text-primary-white py-6'>
            <p>
                <span>
            <svg
              className="inline"
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 0 24 24"
              width="20px"
              fill={`#fff`}
            >
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
            </span> <span>Marketplace</span></p>
            <ul className='flex space-x-8 '>
                <li>
                    <Link href={'/signin'} className="py-[0.45rem] px-8 bg-primary-white text-primary-black font-medium rounded-3xl">Login</Link>
                </li>
                <li>
                    <Link href={'/signup'} className="font-medium">Register</Link>
                </li>
            </ul>
        </nav>
    </header>
    
   <motion.main className='h-screen relative '
   initial={{opacity:0}}
   animate={{opacity:1}}
   transition={{ease:'easeIn', duration:1}}
   >
    <figure className="h-screen w-full">
        <Image
        src={'/homePic.jpg'}
        fill
        priority
        className='object-cover'
        alt={'home page poster'}
        />
    </figure>
   
    <section className='absolute top-[50%] z-[2] space-y-7 w-[80%] mx-auto md:w-[500px] -translate-x-2/4 -translate-y-2/4 text-primary-white left-[50%] '>
        <h1 className="text-3xl md:text-4xl lg:text-5xl">
            House Marketplace
        </h1>
        <p className="md:w-[80%] opacity-80 text-[1.05rem] md:text-lg">
            Welcome to house Market Place, 
            here we make finding your dream home
            easy and painless.
        </p>
        <button onClick={()=> router.push('/signup')} className='bg-primary-green  text-gray-50 sm:text-lg  hover:opacity-75 transition-all ease-in duration-300  font-semibold px-8 rounded-[2rem] py-3'>
            Get Started Today
        </button>
    </section>
     <div
        className="h-full absolute bottom-0 w-full bg-gradient-to-b z-[1] backdrop-blur-lg opacity-50 from-primary-green via-green-800  "
    ></div>
   </motion.main>
   </>
  )
}

export default HomePage;