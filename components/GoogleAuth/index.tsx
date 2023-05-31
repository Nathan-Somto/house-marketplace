import { auth, db } from '@/firebase/firebase.config';
import useAuthStore from '@/store/useAuthStore';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
type props ={
    pathname:"in"|"up"
}
function GoogleAuth({pathname}:props) {
    const login = useAuthStore((state)=>state.login);
    const router = useRouter();
    async function handleGoogleClick(){
      try {
        // initiliaze the google provider.
        const provider = new GoogleAuthProvider();
        const cred = await signInWithPopup(auth,provider);
        const userRef = doc(db, 'users', cred.user.uid);
        // check if the user exists
        const userSnapshot = await getDoc(userRef);
        // add their details to firestore if the user doesn't exist.
        if(!userSnapshot.exists()){
          await setDoc(userRef,{
            firstName:cred.user.displayName,
            email:cred.user.email,
            timestamp:serverTimestamp()
          });
        }
        // login the user in our global store.
        login(cred.user);
        router.replace('/explore');
        
      } catch (error) {
        let message = "there was an error while trying login";
        if (error instanceof Error) {
          message = error.message;
        }
        toast.error(message);
      }
      }
    
  return (
    <div className="flex flex-col  space-y-3">
    <small className="text-gray-500 text-sm">sign {pathname} with</small>
    <button onClick={handleGoogleClick} type="button" className="relative h-[50px] w-[50px] hover:scale-110 duration-300 ease-out flex items-center justify-center rounded-full shadow-lg bg-[#fff] p-3">
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