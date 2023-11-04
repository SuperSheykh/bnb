'use client  '

import Image from 'next/image'
import { useRouter } from 'next/navigation'
const Logo = () => {
   const router = useRouter()
   const reset = () => router.push('/')
   return (
      <Image
         onClick={reset}
         className='hidden md:block cursor-pointer w-auto h-auto'
         src='/images/logo.png'
         alt='logo'
         height='100'
         width='100'
      />
   )
}

export default Logo
