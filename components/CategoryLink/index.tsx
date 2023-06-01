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
    <Link href={`/category/${category}`} className='w-[48%] max-w-[300px] block  space-y-3'>
        <h3 className="ml-4 font-medium opacity-80">{category}</h3>
        <div className="min-h-[120px] relative h-[12vh] group max-h-[300px] overflow-hidden rounded-3xl">           
        <Image
            src={src}
            fill
            alt={`${category}`}
            className="object-cover group-hover:scale-125 transition-all duration-200 ease-linear "
        />
        </div>
    </Link>
  )
}

export default CategoryLink