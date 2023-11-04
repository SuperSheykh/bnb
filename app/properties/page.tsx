import React from 'react'
import getCurrentUser from '../actions/getCurrentUser'
import ClientOnly from '../components/ClientOnly'
import EmptyState from '../components/EmptyState'
import getListing from '../actions/getListings'
import PropertiesClient from './PropertiesClient'

const PropertiesPage = async () => {
   const currentUser = await getCurrentUser()
   if (!currentUser)
      return (
         <ClientOnly>
            <EmptyState title='Unauthorized' subtitle='Please login' />
         </ClientOnly>
      )

   const listings = await getListing({ userId: currentUser.id })
   if (listings.length === 0)
      return (
         <ClientOnly>
            <EmptyState
               title='No Listings found'
               subtitle='Looks like you have no properties listed.'
            />
         </ClientOnly>
      )

   return (
      <ClientOnly>
         <PropertiesClient listings={listings} currentUser={currentUser} />
      </ClientOnly>
   )
}

export default PropertiesPage
