import getCurrentUser from '@/app/actions/getCurrentUser'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'

export async function POST(request: NextRequest) {
   const user = await getCurrentUser()
   if (!user) return NextResponse.error()

   const {
      category,
      location,
      guestCount,
      roomCount,
      bathroomCount,
      imageSrc,
      price,
      title,
      description,
   } = await request.json()

   if (
      !category ||
      !location ||
      !guestCount ||
      !roomCount ||
      !bathroomCount ||
      !imageSrc ||
      !price ||
      !title ||
      !description
   ) {
      return NextResponse.error()
   }

   const listing = await prisma.listing.create({
      data: {
         category,
         locationValue: location.value,
         questCount: guestCount,
         roomCount,
         bathroomCount,
         imageSrc,
         price: parseInt(price, 10),
         title,
         description,
         userId: user.id,
      },
   })

   if (!listing) {
      return NextResponse.error()
   }

   return NextResponse.json(listing)
}
