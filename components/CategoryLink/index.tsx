import { category } from '@/types'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
type Props = {
    category:category,
    src:string
}
function CategoryLink({category,src}:Props) {
  return (
    <Link href={`/category/${category}`} className='w-[50%]  block  space-y-4'>
       
        <div className="min-h-[200px] relative h-[15vh] group max-h-[500px] overflow-hidden rounded-3xl">           
        <Image
            src={src}
            fill
            alt={`${category}`}
            className="object-cover group-hover:scale-125 transition-all w-full duration-200 ease-linear "
        />
        </div>
         <h4 className="ml-4 font-medium ">Places for {category}</h4>
    </Link>
  )
}

export default CategoryLink