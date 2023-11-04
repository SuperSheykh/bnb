'use client'

import React, { ReactElement, useCallback, useState } from 'react'
import axios from 'axios'
import { AiFillGithub } from 'react-icons/ai'
import { FcGoogle } from 'react-icons/fc'
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form'
import useRegisterModal from '@/app/hooks/useRegisterModal'
import Modal from './Modal'
import Heading from '../Heading'
import Input from '../Input'
import toast from 'react-hot-toast'
import Button from '../Button'
import { signIn } from 'next-auth/react'
import useLoginModal from '@/app/hooks/useLoginModal'

const RegisterModal = () => {
   const registerModal = useRegisterModal()
   const loginModal = useLoginModal()
   const [isLoading, setIsLoading] = useState(false)
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<FieldValues>({
      defaultValues: { name: '', email: '', password: '' },
   })

   const onSubmit: SubmitHandler<FieldValues> = (data) => {
      setIsLoading(true)
      axios
         .post('/api/register', data)
         .then((res) => {
            console.log(res)

            registerModal.onClose()
            toast.success(`You're welcome, sir ${res.data.name}`)
         })
         .catch((error) => {
            console.log(error)
            toast.error('Something went wrong!')
         })
         .finally(() => {
            setIsLoading(false)
         })
   }

   const toggleModal = () => {
      registerModal.onClose()
      loginModal.onOpen()
   }

   const bodyContent: ReactElement = (
      <div className='flex flex-col gap-4'>
         <Heading title='Welcome to Airbnb' subtitle='Create an account' />
         <Input
            id='email'
            label='Email'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
         />
         <Input
            id='name'
            label='Name'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
         />
         <Input
            id='password'
            type='password'
            label='Password'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
         />
      </div>
   )

   const footerContent = (
      <div className='flex flex-col gap-4 mt-3'>
         <hr />
         <Button
            outline
            label='Continue with Google'
            icon={FcGoogle}
            onClick={() => signIn('google')}
         />
         <Button
            outline
            label='Continue with Github'
            icon={AiFillGithub}
            onClick={() => signIn('github')}
         />
         <div className='text-neutral-500 text-center mt-4 font-light'>
            <div className='justify-center flex flex-row items-center gap-2'>
               <div>Already have an account?</div>
               <div
                  onClick={toggleModal}
                  className='text-neutral-800 cursor-pointer hover:underline'
               >
                  Log in
               </div>
            </div>
         </div>
      </div>
   )

   return (
      <Modal
         disabled={isLoading}
         isOpen={registerModal.isOpen}
         title='Register'
         actionLabel='Continue'
         onClose={registerModal.onClose}
         onSubmit={handleSubmit(onSubmit)}
         body={bodyContent}
         footer={footerContent}
      />
   )
}

export default RegisterModal