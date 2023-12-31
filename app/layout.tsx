import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'
import Navbar from './components/navbar/Navbar'
import Modal from './components/modals/Modal'
import RegisterModal from './components/modals/RegisterModal'
import LoginModal from './components/modals/LoginModal'
import ToasterProvider from './providers/ToasterProvider'
import getCurrentUser from './actions/getCurrentUser'
import ClientOnly from './components/ClientOnly'
import RentModal from './components/modals/RentModal'
import SearchModal from './components/modals/SearchModal'

const font = Nunito({ subsets: ['latin'] })

export const metadata: Metadata = {
   title: 'Airbnb',
   description: 'airbnb clone project',
}

export default async function RootLayout({
   children,
}: {
   children: React.ReactNode
}) {
   const currentUser = await getCurrentUser()

   return (
      <html lang='en'>
         <body className={font.className}>
            <ClientOnly>
               <ToasterProvider />
               <Navbar currentUser={currentUser} />
               <RegisterModal />
               <LoginModal />
               <RentModal />
               <SearchModal />
            </ClientOnly>
            <div className='py-20'>{children}</div>
         </body>
      </html>
   )
}
