import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import prisma from '@/app/libs/prismadb'
const getSession = async () => {
   return getServerSession(authOptions)
}

const getCurrentUser = async () => {
   try {
      const session = await getSession()

      if (!session) return null

      const user = await prisma.user.findUnique({
         where: { email: session.user?.email as string },
      })

      if (!user) return null

      return user
   } catch (err) {
      return null
   }
}

export default getCurrentUser
