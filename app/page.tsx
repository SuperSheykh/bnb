import Image from 'next/image'
import ClientOnly from './components/ClientOnly'
import Container from './components/Container'
import EmptyState from './components/EmptyState'
import getListing, { IListingsParams } from './actions/getListings'
import ListingCard from './components/listings/ListingCard'
import getCurrentUser from './actions/getCurrentUser'

interface HomeProps {
   searchParams: IListingsParams
}

export default async function Home({ searchParams }: HomeProps) {
   const listings = await getListing(searchParams)
   const currentUser = await getCurrentUser()

   if (listings.length === 0) {
      return (
         <ClientOnly>
            <Container>
               <EmptyState showReset />
            </Container>
         </ClientOnly>
      )
   }

   return (
      <ClientOnly>
         <Container>
            <div
               className='
               pt-28
               grid
               grid-cols-1
               sm:grid-cols-2
               md:grid-cols-3
               lg:grid-cols-4
               xl:grid-cols-5
               2xl:grid-cols-6
               gap-4
            '
            >
               {listings.map((item) => (
                  <ListingCard data={item} currentUser={currentUser} />
               ))}
            </div>
         </Container>
      </ClientOnly>
   )
}
