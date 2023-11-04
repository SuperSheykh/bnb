'use client'
import { useCallback, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Modal from './Modal'

import useSearchModal from '@/app/hooks/useSearchModal'
import Heading from '../Heading'
import CountrySelect, { CountrySelectValue } from '../inputs/CountrySelect'
import { Range } from 'react-date-range'
import qs from 'query-string'
import dynamic from 'next/dynamic'
import { formatISO } from 'date-fns'
import Calendar from '../inputs/Calendar'
import Counter from '../inputs/Counter'

enum STEPS {
   LOCATION,
   DATE,
   INFO,
}

interface SearchParamsType {
   category?: string
   location?: string
   roomCount?: string
   bathroomCount?: string
   guestCount?: string
   dateRange?: Range
}

// This are my comments!

const SearchModal = () => {
   const router = useRouter()
   const params = useSearchParams()
   const { isOpen, onClose } = useSearchModal()

   const [step, setStep] = useState<STEPS>(STEPS.LOCATION)
   const [location, setLocation] = useState<CountrySelectValue>()
   const [roomCount, setRoomCount] = useState(1)
   const [bathroomCount, setBathroomCount] = useState(1)
   const [guestCount, setGuestCount] = useState(1)
   const [dateRange, setDateRange] = useState<Range>({
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
   })

   const actionLabel = useMemo(() => {
      if (step === STEPS.INFO) return 'Search'
      return 'Next'
   }, [step])

   const secondaryActionLabel = useMemo(() => {
      if (step !== STEPS.LOCATION) return 'Back'
   }, [step])

   const onNext = useCallback(() => {
      setStep(step + 1)
   }, [step])

   const onBack = useCallback(() => {
      setStep(step - 1)
   }, [step])

   const onSubmit = useCallback(() => {
      if (step !== STEPS.INFO) {
         return onNext()
      }

      let currentParams = {}

      if (params) {
         currentParams = qs.parse(params?.toString())
      }

      const updatedParams: any = {
         ...currentParams,
         locationValue: location?.value,
         roomCount,
         bathroomCount,
         guestCount,
      }

      if (dateRange.startDate) {
         updatedParams.startDate = formatISO(dateRange.startDate)
      }

      if (dateRange.endDate) {
         updatedParams.endDate = formatISO(dateRange.endDate)
      }

      const url = qs.stringifyUrl(
         { url: '/', query: updatedParams },
         { skipNull: true }
      )
      setStep(STEPS.LOCATION)
      onClose()
      router.push(url)
   }, [
      step,
      params,
      location,
      roomCount,
      bathroomCount,
      guestCount,
      router,
      onClose,
      onNext,
      dateRange,
   ])

   const Map = useMemo(
      () => dynamic(() => import('../Map'), { ssr: false }),
      [location]
   )

   let body: React.ReactNode = (
      <div className='flex flex-col gap-8'>
         <Heading
            title='Where do you wanna go?'
            subtitle='Find the perfect location!'
         />
         <CountrySelect
            value={location}
            onChange={(value) => setLocation(value)}
         />
         <hr />
         <Map center={location?.latlng} />
      </div>
   )

   if (step === STEPS.DATE) {
      body = (
         <div className='flex flex-col gap-8'>
            <Heading
               title='When do you plan to go?'
               subtitle='Make sure everyone is free!'
            />
            <Calendar
               value={dateRange}
               onChange={(value) => setDateRange(value.selection)}
            />
         </div>
      )
   }

   if (step === STEPS.INFO) {
      body = (
         <div className='flex flex-col gap-8'>
            <Heading
               title='More information'
               subtitle='Find your perfect place!'
            />
            <Counter
               title='Guests'
               subtitle='How many guests are coming?'
               value={guestCount}
               onChange={(value) => setGuestCount(value)}
            />
            <Counter
               title='Rooms'
               subtitle='How many rooms do you need?'
               value={roomCount}
               onChange={(value) => setRoomCount(value)}
            />
            <Counter
               title='Bathrooms'
               subtitle='How many bathrooms do you need?'
               value={bathroomCount}
               onChange={(value) => setBathroomCount(value)}
            />
         </div>
      )
   }

   return (
      <Modal
         title='Filters'
         isOpen={isOpen}
         actionLabel={actionLabel}
         secondaryActionLabel={secondaryActionLabel}
         secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
         onClose={onClose}
         onSubmit={onSubmit}
         body={body}
      />
   )
}

export default SearchModal
