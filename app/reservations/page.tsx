import React from 'react'
import ReservationsClient from './ReservationsClient'

import getCurrentUser from '../actions/getCurrentUser'
import ClientOnly from '../components/ClientOnly'
import EmptyState from '../components/EmptyState'
import getReservations from '../actions/getReservations'

interface ReservationProps {}

const ReservationPage = async () => {
   const currentUser = await getCurrentUser()

   if (!currentUser) {
      return (
         <ClientOnly>
            <EmptyState title='Unauthorized' subtitle='Please login' />
         </ClientOnly>
      )
   }

   const reservations = await getReservations({ authorId: currentUser.id })
   if (!reservations) {
      return (
         <ClientOnly>
            <EmptyState
               title='No reservations'
               subtitle='Please make some reservations first.'
            />
         </ClientOnly>
      )
   }

   return (
      <ClientOnly>
         <ReservationsClient
            reservations={reservations}
            currentUser={currentUser}
         />
      </ClientOnly>
   )
}

export default ReservationPage
