import getCurrentUser from '@/app/actions/getCurrentUser'
import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'

export async function POST(request: Request) {
   const user = await getCurrentUser()
   if (!user) return NextResponse.error()

   const body = await request.json()

   const { totalPrice, startDate, endDate, listingId } = body

   if (!totalPrice || !startDate || !endDate || !listingId)
      return NextResponse.error()

   const listingWithReservation = await prisma.listing.update({
      where: {
         id: listingId,
      },
      data: {
         reservations: {
            create: {
               totalPrice,
               startDate,
               endDate,
               userId: user.id,
            },
         },
      },
   })

   return NextResponse.json(listingWithReservation)
}
