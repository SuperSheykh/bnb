import bcrypt from 'bcrypt'
import prisma from '@/app/libs/prismadb'

export async function POST(request: Request) {
   const body = await request.json()

   const { name, email, password } = body

   const hashedPassword = await bcrypt.hash(password, 12)

   const user = await prisma.user.create({
      data: { name, email, hashedPassword },
   })

   return Response.json(user)
}

// SEEMS TO BE A PROBLEM WITH THIS BECAUSE WE ARE NOT CHECKING IF THE EMAIL PROVIDED ALREADY
