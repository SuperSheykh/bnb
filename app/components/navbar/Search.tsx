'use client'
import useCountries from '@/app/hooks/useCountries'
import useSearchModal from '@/app/hooks/useSearchModal'
import { differenceInDays } from 'date-fns'
import { useSearchParams } from 'next/dist/client/components/navigation'
import { useMemo } from 'react'
import { BiSearch } from 'react-icons/bi'
const Search = () => {
   const { onOpen } = useSearchModal()
   const params = useSearchParams()
   const { getByValue } = useCountries()

   const location = params?.get('locationValue')
   const guestCount = params?.get('guestCount')
   const startDate = params?.get('startDate')
   const endDate = params?.get('endDate')

   const locationLabel = useMemo(() => {
      if (location) return getByValue(location)?.label

      return 'Anywhere'
   }, [location, getByValue])

   const durationLabel = useMemo(() => {
      if (startDate && endDate) {
         const diff = differenceInDays(
            new Date(endDate as string),
            new Date(startDate as string)
         )

         const days = diff === 0 ? 1 : diff

         return `${days} days`
      }
      return 'Any week'
   }, [startDate, endDate, differenceInDays])

   const guestsLabel = useMemo(() => {
      if (guestCount) {
         return `${guestCount} guests`
      }
      return 'Add guests'
   }, [guestCount])

   return (
      <div
         onClick={onOpen}
         className='
        border-[1px] w-full md:w-auto py-2 rounded-full shadow-sm hover:shadow-md transition cursor-pointer
    '
      >
         <div className='flex flex-row items-center justify-between'>
            <div className='text-sm font-semibold px-6'>{locationLabel}</div>
            <div className='hidden sm:block text-sm font-semibold px-6 border-x-[1px] flex-1 text-center'>
               {durationLabel}
            </div>
            <div className='text-sm pl-6 pr-2 text-gray-600 flex flex-row items-center gap-3'>
               <div className='hidden sm:block'>{guestsLabel}</div>
               <div className='p-2 bg-rose-500 rounded-full text-white'>
                  <BiSearch size={18} />
               </div>
            </div>
         </div>
      </div>
   )
}

export default Search
