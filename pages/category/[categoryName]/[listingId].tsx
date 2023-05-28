
import {useRouter} from 'next/router'
type Props = {}

function Listing({}: Props) {
    const router = useRouter();
    console.log(router.query);
  return (
    <div>
       <h1>this is the page for {router.query?.categoryName} with an id of {router.query?.listingId}</h1> 
       <p>hello world</p>
    </div>
  )
}

export default Listing