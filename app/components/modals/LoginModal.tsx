'use client'

import React, { ReactElement, useCallback, useState } from 'react'
import axios from 'axios'
import { AiFillGithub } from 'react-icons/ai'
import { FcGoogle } from 'react-icons/fc'
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form'
import useLoginModal from '@/app/hooks/useLoginModal'
import Modal from './Modal'
import Heading from '../Heading'
import Input from '../Input'
import toast from 'react-hot-toast'
import Button from '../Button'
import useRegisterModal from '@/app/hooks/useRegisterModal'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const LoginModal = () => {
   const loginModal = useLoginModal()
   const registerModal = useRegisterModal()
   const router = useRouter()

   const [isLoading, setIsLoading] = useState(false)
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<FieldValues>({
      defaultValues: { email: '', password: '' },
   })

   const onSubmit: SubmitHandler<FieldValues> = (data) => {
      setIsLoading(true)
      signIn('credentials', { ...data, redirect: false }).then((callback) => {
         setIsLoading(false)
         if (callback?.ok) {
            loginModal.onClose()
            toast.success('I are logged in!')
            router.refresh()
         }
         if (callback?.error) {
            toast.error(callback.error)
         }
      })
   }

   const toggleModal = () => {
      loginModal.onClose()
      registerModal.onOpen()
   }

   const bodyContent: ReactElement = (
      <div className='flex flex-col gap-4'>
         <Heading title='Welcome back' subtitle='Login to your account' />
         <Input
            id='email'
            label='Email'
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
               <div>First time on the here?</div>
               <div
                  onClick={toggleModal}
                  className='text-neutral-800 cursor-pointer hover:underline'
               >
                  Sign up
               </div>
            </div>
         </div>
      </div>
   )

   return (
      <Modal
         disabled={isLoading}
         isOpen={loginModal.isOpen}
         title='Login'
         actionLabel='Continue'
         onClose={loginModal.onClose}
         onSubmit={handleSubmit(onSubmit)}
         body={bodyContent}
         footer={footerContent}
      />
   )
}

export default LoginModal
