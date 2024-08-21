import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog'
import { getToken } from '@/utils/tokenUtils'
import Image from 'next/image'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '../ui/carousel'

interface ImageUploadDialogProps {
    productId: number | null
    images: string[] | null
    openDialogImage: boolean
    setOpenDialogImage: React.Dispatch<React.SetStateAction<boolean>>
}

interface FormData {
    image: FileList
}

const ImageUploadDialog: React.FC<ImageUploadDialogProps> = ({
    productId,
    images,
    openDialogImage,
    setOpenDialogImage,
}) => {
    const [productImages, setProductImages] = useState<string[] | null>(images)

    useEffect(() => {
        setProductImages(images)
    }, [images])

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>()

    const onSubmit = async (data: FormData) => {
        const formData = new FormData()
        formData.append('product_image', data.image[0])

        try {
            const token = getToken()
            const response = await axios.post(
                `http://127.0.0.1:5000/product/upload-image/${productId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            )
            console.log(response.data.data)
            const imageUrls = response.data.data
                .map((item: { image_url: string }) => item.image_url)
                .reverse()

            setProductImages(imageUrls)
            alert('Image uploaded successfully!')
        } catch (error) {
            console.error('Failed to upload image:', error)
            alert('Failed to upload image.')
        }
    }

    return (
        <Dialog open={openDialogImage} onOpenChange={setOpenDialogImage}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Product Image</DialogTitle>
                    <DialogDescription>
                        Please select an image to upload for the product.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="mb-2 flex gap-2"
                    >
                        <div>
                            <Input
                                id="picture"
                                type="file"
                                accept="image/*"
                                {...register('image', {
                                    required: 'Image is required',
                                })}
                            />
                            {errors.image && (
                                <span className="text-xs text-red-500">
                                    {errors.image.message}
                                </span>
                            )}
                        </div>
                        <Button type="submit">Upload</Button>
                    </form>

                    {productImages && productImages.length > 0 ? (
                        <Carousel className="w-full">
                            <CarouselContent>
                                <>
                                    {productImages.map((image, index) => (
                                        <CarouselItem
                                            key={index}
                                            className="w-full"
                                        >
                                            <Image
                                                width={600}
                                                height={600}
                                                key={index}
                                                src={image}
                                                alt={`Product Image ${index + 1}`}
                                                className="aspect-square object-contain"
                                            />
                                        </CarouselItem>
                                    ))}
                                </>
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    ) : (
                        <p>No images uploaded yet.</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ImageUploadDialog
