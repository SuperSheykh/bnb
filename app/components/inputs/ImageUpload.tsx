import { CldUploadWidget } from 'next-cloudinary'

import Image from 'next/image'
import { useCallback, useState } from 'react'
import { TbPhotoPlus } from 'react-icons/tb'

declare global {
   var cloudinary: any
}

interface ImageUploadProps {
   onChange: (value: string) => void
   value: string
}

type ImageDetails = {
   width: number
   height: number
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange }) => {
   const [imageDetail, setImageDetails] = useState<ImageDetails | null>(null)
   console.log(value)
   const handleUpload = useCallback(
      (result: any) => {
         console.log(result)
         onChange(result.info.secure_url)
         setImageDetails({
            width: result.info.width,
            height: result.info.height,
         })
      },
      [onChange]
   )

   return (
      <CldUploadWidget
         onUpload={handleUpload}
         uploadPreset='k2wlyczl'
         options={{
            maxFiles: 1,
         }}
      >
         {({ open }) => (
            <div
               onClick={() => open?.()}
               className='relative cursor-pointer hover:opacity-70 transition border-dashed border-2 p-20 border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-600'
            >
               <TbPhotoPlus size={50} />
               <div className='font-semibold text-lg'>Click to upload</div>
               {value && (
                  <div className='absolute inset-0 w-full h-full'>
                     <Image
                        src={value}
                        alt='upload'
                        width={imageDetail?.width}
                        height={imageDetail?.height}
                        style={{
                           objectFit: 'cover',
                           width: '100%',
                           height: '100%',
                        }}
                     />
                  </div>
               )}
            </div>
         )}
      </CldUploadWidget>
   )
}

export default ImageUpload
