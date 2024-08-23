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
import { Trash } from 'lucide-react'

interface Images {
    id: number
    image_url: string
    product_id: number
}

interface ImageUploadDialogProps {
    productId: number | null
    images: Images[] | null
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
    const [productImages, setProductImages] = useState<Images[] | null>(images)

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

    const handleDeleteImage = async (imageUrl: string, imageId: number) => {
        try {
            const token = getToken()
            // new api delete image
            const response = await axios.delete(
                `http://127.0.0.1:5000/product/${productId}/${imageId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            setProductImages(
                (prevImages) =>
                    prevImages?.filter((img) => img.image_url !== imageUrl) ||
                    null
            )
            alert('Image deleted successfully!')
        } catch (error) {
            console.error('Failed to delete image:', error)
            alert('Failed to delete image.')
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
                        <div className="w-2/3">
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
                        <Button className="w-1/3" type="submit">
                            Upload
                        </Button>
                    </form>

                    {productImages && productImages.length > 0 ? (
                        <Carousel className="w-full">
                            <CarouselContent>
                                {productImages.map((image, index) => (
                                    <CarouselItem
                                        key={index}
                                        className="relative w-full"
                                    >
                                        <Image
                                            width={600}
                                            height={600}
                                            src={image.image_url}
                                            alt={`Product Image ${index + 1}`}
                                            className="aspect-square overflow-hidden rounded-xl border border-gray-200 object-contain"
                                        />
                                        <Button
                                            size={'icon'}
                                            className="absolute right-2 top-2 h-8 w-8 rounded-full bg-red-500 p-1 text-white"
                                            onClick={() =>
                                                handleDeleteImage(
                                                    image.image_url,
                                                    image.id
                                                )
                                            }
                                        >
                                            <Trash className="h-3 w-3" />
                                        </Button>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-2" />
                            <CarouselNext className="right-2" />
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
