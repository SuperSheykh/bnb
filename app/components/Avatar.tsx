'use client'
import Image from 'next/image'

import React from 'react'

interface AvatarProps {
   src?: string | undefined | null
}

const Avatar: React.FC<AvatarProps> = ({ src }) => {
   return (
      <Image
         src={src || '/images/placeholder.jpg'}
         alt='Avatar'
         height='30'
         width='30'
         className='rounded-full'
      />
   )
}

export default Avatar
