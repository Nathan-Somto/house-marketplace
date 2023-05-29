import Image from 'next/image';
type props ={
    pathname:"in"|"up"
}
function GoogleAuth({pathname}:props) {
    /**@todo implement google authentication */
  return (
    <div className="flex flex-col  space-y-3">
    <small className="text-gray-500 text-sm">sign {pathname} with</small>
    <button className="relative h-[50px] w-[50px] hover:scale-110 duration-300 ease-out flex items-center justify-center rounded-full shadow-lg bg-[#fff] p-3">
      <Image
        src="/svg/googleIcon.svg"
        alt="google icon"
        width={25}
        height={25}
      />
    </button>
  </div>
  )
}

export default GoogleAuth