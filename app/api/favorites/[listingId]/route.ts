import { NextResponse } from 'next/server'

import getCurrentUser from '@/app/actions/getCurrentUser'
import prisma from '@/app/libs/prismadb'

interface IdParams {
   listingId?: string
}

export async function POST(request: Request, { params }: { params: IdParams }) {
   const currentUser = await getCurrentUser()
   if (!currentUser) return NextResponse.error()

   if (!params.listingId || typeof params.listingId !== 'string') {
      throw new Error('Invalid ID')
   }

   const favoriteIds = [...(currentUser.favoriteIds || [])]
   favoriteIds.push(params.listingId)

   const user = await prisma.user.update({
      where: {
         id: currentUser.id,
      },
      data: {
         favoriteIds,
      },
   })

   return NextResponse.json(user)
}

export async function DELETE(
   request: Request,
   { params }: { params: IdParams }
) {
   const currentUser = await getCurrentUser()
   if (!currentUser) return NextResponse.error()

   if (!params.listingId || typeof params.listingId !== 'string') {
      throw new Error('Invalid ID')
   }

   const favoriteIds = currentUser.favoriteIds.filter(
      (id) => id !== params.listingId
   )

   const user = await prisma.user.update({
      where: {
         id: currentUser.id,
      },
      data: {
         favoriteIds,
      },
   })

   return NextResponse.json(user)
}
