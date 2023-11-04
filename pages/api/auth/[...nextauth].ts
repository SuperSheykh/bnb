import { PrismaAdapter } from '@next-auth/prisma-adapter'
import NextAuth, { AuthOptions } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from '@/app/libs/prismadb'
import bcrypt from 'bcrypt'

export const authOptions: AuthOptions = {
   adapter: PrismaAdapter(prisma),
   providers: [
      GitHubProvider({
         clientId: process.env.GITHUB_ID as string,
         clientSecret: process.env.GITHUB_SECRET as string,
      }),
      GoogleProvider({
         clientId: process.env.GOOGLE_CLIENT_ID as string,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      }),
      CredentialsProvider({
         name: 'credentials',
         credentials: {
            email: { label: 'email', type: 'text' },
            password: { label: 'password', type: 'text' },
         },
         authorize: async (credentials) => {
            if (!credentials?.email || !credentials.password) {
               throw new Error('Invalid credentials')
            }

            const user = await prisma.user.findUnique({
               where: { email: credentials.email },
            })
            // CHECKING IF USER WITH THAT EMAIL EXISTS
            if (!user || !user.hashedPassword) {
               throw new Error('Invalid credentials')
            }
            // CHECKING IF THE PASSWORD IS CORRECT
            const isCorrectPassword = bcrypt.compare(
               credentials.password,
               user.hashedPassword
            )
            if (!isCorrectPassword) throw new Error('Invalid credentials')

            return user
         },
      }),
   ],
   // THESE FUNCTIONS FIRE UP WHEN THE ACTIONS ARE CALLED!
   callbacks: {
      signIn: async ({ user, account, profile, email, credentials }) => {
         console.log('signin in..')
         return true
      },
   },
   pages: {
      signIn: '/',
      error: '/',
   },
   debug: process.env.NODE_ENV === 'development',
   session: {
      strategy: 'jwt',
   },
   secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)
