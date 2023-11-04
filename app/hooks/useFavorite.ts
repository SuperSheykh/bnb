import { User } from '@prisma/client'
import axios from 'axios'
import { useCallback, useMemo } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import useLoginModal from './useLoginModal'

interface UseFavoriteProps {
   listingId: string
   currentUser?: User | null
}

const useFavorite = ({ listingId, currentUser }: UseFavoriteProps) => {
   const router = useRouter()
   const { onOpen } = useLoginModal()

   // THIS LINE WILL CHECK IF THE CLICKED LISTING IS LIKED OR NOT
   const hasFavorited = useMemo(() => {
      const favorites = currentUser?.favoriteIds || []

      return favorites.includes(listingId)
   }, [currentUser, listingId])

   const toggleFavorite = useCallback(
      async (e: React.MouseEvent<HTMLDivElement>) => {
         e.stopPropagation()

         if (!currentUser) return onOpen()

         //    DEFINING WHICH TYPE OF REQUEST IS MADE
         let request
         if (hasFavorited) {
            request = async () =>
               await axios.delete<User>(`/api/favorites/${listingId}`)
         } else {
            request = async () =>
               await axios.post(`/api/favorites/${listingId}`)
         }

         //     MAKING THE REQUEST
         try {
            await request()
            toast.success('success!')
            router.refresh()
         } catch (error) {
            toast.error('Something went wrong!')
            console.log(error)
         }
      },
      [currentUser, hasFavorited, listingId, onOpen, router]
   )

   return { hasFavorited, toggleFavorite }
}

export default useFavorite
