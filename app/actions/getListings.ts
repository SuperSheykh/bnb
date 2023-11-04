import prisma from '../libs/prismadb'

export interface IListingsParams {
   userId?: string
   locationValue?: string
   roomCount?: number
   bathroomCount?: number
   guestCount?: number
   startDate?: string
   endDate?: string
   category?: string
}

export default async function getListing(params: IListingsParams) {
   try {
      const {
         userId,
         locationValue,
         roomCount,
         bathroomCount,
         guestCount,
         startDate,
         endDate,
         category,
      } = params

      const query: any = {}

      if (userId) {
         query.userId = userId
      }

      if (locationValue) {
         query.locationValue = locationValue
      }

      if (roomCount) {
         query.roomCount = { gte: +roomCount }
      }

      if (category) {
         query.category = category
      }

      if (bathroomCount) {
         query.bathroomCount = { gte: +bathroomCount }
      }

      if (guestCount) {
         query.questCount = { gte: +guestCount }
      }

      if (startDate && endDate) {
         query.NOT = {
            reservations: {
               some: {
                  OR: [
                     {
                        endDate: { gte: startDate },
                        startDate: { lte: startDate },
                     },
                     {
                        startDate: { lte: endDate },
                        endDate: { gte: endDate },
                     },
                  ],
               },
            },
         }
      }

      const listings = await prisma.listing.findMany({
         where: query,
         orderBy: {
            createdAt: 'desc',
         },
      })
      return listings
   } catch (error: any) {
      console.log(error)
      throw new Error(error)
   }
}
