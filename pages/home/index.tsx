import Image from 'next/image';
import {useRouter} from 'next/router';
function HomePage() {
    const router = useRouter();
  return (
   <main className='h-screen relative'>
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
        <button onClick={()=> router.push('/signup')} className='bg-primary-green text-gray-50 sm:text-lg border-primary-green border-[0.15rem] transition-all ease-in duration-300  font-semibold px-8 rounded-3xl py-3'>
            Get Started Today
        </button>
    </section>
     <div
        className="h-full absolute bottom-0 w-full bg-gradient-to-b z-[1] backdrop-blur-lg opacity-50 from-primary-green via-green-800  "
    ></div>
   </main>
  )
}

export default HomePage