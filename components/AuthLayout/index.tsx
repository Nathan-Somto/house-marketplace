import { ReactNode } from "react"
import Navbar from "../Navbar"

function AuthLayout({children}:{children:ReactNode}) {
  return (
    <>
    <Navbar/>
    <main className="md:max-w-[calc(100%-250px)] md:ml-auto w-full">
        {children}
    </main>
    </>
  )
}

export default AuthLayout