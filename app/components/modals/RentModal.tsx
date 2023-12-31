'use client'
import React, { useMemo, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

import Modal from './Modal'
import useRentModal from '@/app/hooks/useRentModal'
import Heading from '../Heading'
import { categories } from '../navbar/Categories'
import CategoryInput from '../inputs/CategoryInput'
import CountrySelect from '../inputs/CountrySelect'
import Counter from '../inputs/Counter'
import ImageUpload from '../inputs/ImageUpload'
import Input from '../Input'

enum STEPS {
   CATEGORY,
   LOCATION,
   INFO,
   IMAGES,
   DESCRIPTION,
   PRICE,
}

const RentModal = () => {
   const router = useRouter()
   const [step, setStep] = useState<STEPS>(STEPS.CATEGORY)
   const { isOpen, onClose } = useRentModal()
   const [isLoading, setIsLoading] = useState(false)

   const {
      register,
      setValue,
      watch,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm<FieldValues>({
      defaultValues: {
         category: '',
         location: null,
         guestCount: 1,
         roomCount: 1,
         bathroomCount: 1,
         imageSrc: '',
         price: 1,
         title: '',
         description: '',
      },
   })

   const category = watch('category')
   const location = watch('location')
   const guestCount = watch('guestCount')
   const roomCount = watch('roomCount')
   const bathroomCount = watch('bathroomCount')
   const imageSrc = watch('imageSrc')

   const Map = useMemo(
      () =>
         dynamic(() => import('../Map'), {
            ssr: false,
         }),
      [location]
   )

   const setCustomValue = (id: string, value: any) => {
      setValue(id, value, {
         shouldDirty: true,
         shouldTouch: true,
         shouldValidate: true,
      })
   }

   // NAVIGATION ACTIONS
   const onBack = () => {
      setStep((value) => value - 1)
   }
   const onNext = () => {
      setStep((value) => value + 1)
   }

   const onSubmit: SubmitHandler<FieldValues> = (data) => {
      if (step !== STEPS.PRICE) {
         return onNext()
      }

      setIsLoading(true)
      axios
         .post('/api/listings', data)
         .then(() => {
            toast.success('Listing created!')
            reset()
            setStep(STEPS.CATEGORY)
            onClose()
            router.refresh()
         })
         .catch((error) => {
            toast.error('Something went wrong!')
         })
         .finally(() => {
            setIsLoading(false)
         })
   }

   const actionLabel = useMemo(() => {
      return step === STEPS.PRICE ? 'Create' : 'Next'
   }, [step])

   const secondaryActionLabel = useMemo(() => {
      return step === STEPS.CATEGORY ? undefined : 'Back'
   }, [step])

   // STEP ONE - CATEGORY SELECTION
   let bodyContent = (
      <div className='flex flex-col gap-8'>
         <Heading
            title='Which of these best describes your place?'
            subtitle='Pick a category'
         />
         <div
            className='
            grid
            grid-cols-1
            md:grid-cols-2
            gap-3
            max-h-[50vh]
            overflow-y-auto
         '
         >
            {categories.map((item) => (
               <div key={item.label} className='col-span-1'>
                  <CategoryInput
                     onClick={(category) =>
                        setCustomValue('category', category)
                     }
                     selected={category === item.label}
                     label={item.label}
                     icon={item.icon}
                  />
               </div>
            ))}
         </div>
      </div>
   )

   // STEP TWO - LOCATION SELECTION
   if (step === STEPS.LOCATION) {
      bodyContent = (
         <div className='flex flex-col gap-8'>
            <Heading
               title='Where is your place located?'
               subtitle='Help guests find you!'
            />
            <CountrySelect
               value={location}
               onChange={(value) => setCustomValue('location', value)}
            />
            <Map center={location?.latlng} />
         </div>
      )
   }

   // STEP THREE - INFO
   if (step === STEPS.INFO) {
      bodyContent = (
         <div className='flex flex-col gap-8'>
            <Heading
               title='Share some basics about your place'
               subtitle='What amenities do you have?'
            />
            <Counter
               title='Guests'
               subtitle='How many guests do you have?'
               value={guestCount}
               onChange={(value) => setCustomValue('guestCount', value)}
            />
            <hr />
            <Counter
               title='Rooms'
               subtitle='How many rooms do you have?'
               value={roomCount}
               onChange={(value) => setCustomValue('roomCount', value)}
            />
            <hr />
            <Counter
               title='Bathrooms'
               subtitle='How many bathrooms do you have?'
               value={bathroomCount}
               onChange={(value) => setCustomValue('bathroomCount', value)}
            />
         </div>
      )
   }

   // STEP FOUR - IMAGE UPLOAD
   if (step === STEPS.IMAGES) {
      bodyContent = (
         <div className='flex flex-col gap-8'>
            <Heading
               title='Add a photo of your place'
               subtitle='Which Image best describes your home'
            />
            <ImageUpload
               value={imageSrc}
               onChange={(value) => setCustomValue('imageSrc', value)}
            />
         </div>
      )
   }

   // STEP FIVE - TITLE AND DESCRIPTION
   if (step === STEPS.DESCRIPTION) {
      bodyContent = (
         <div className='flex flex-col gap-8'>
            <Heading
               title='How would you describe your place'
               subtitle='Short and sweet works best'
            />
            <Input
               id='title'
               label='Title'
               register={register}
               errors={errors}
               required
               disabled={isLoading}
            />
            <hr />
            <Input
               id='description'
               label='Description'
               register={register}
               errors={errors}
               required
               disabled={isLoading}
            />
         </div>
      )
   }

   // STEP SIX - PRICE DEFINITION
   if (step === STEPS.PRICE) {
      bodyContent = (
         <div className='flex flex-col gap-8'>
            <Heading
               title='Now set your price'
               subtitle='How much do you price per night?'
            />
            <Input
               id='price'
               label='Price'
               register={register}
               type='number'
               errors={errors}
               disabled={isLoading}
               formatPrice
               required
            />
         </div>
      )
   }

   return (
      <Modal
         title='Airbnb your home'
         actionLabel={actionLabel}
         secondaryActionLabel={secondaryActionLabel}
         secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
         onClose={onClose}
         onSubmit={handleSubmit(onSubmit)}
         isOpen={isOpen}
         body={bodyContent}
         disabled={isLoading}
      />
   )
}

export default RentModal
