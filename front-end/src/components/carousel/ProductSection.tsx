import React from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '../ui/carousel'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowDownRight } from 'lucide-react'
import { Badge } from '../ui/badge'

interface image {
    id: number
    image_url: string
}

interface Product {
    id: number
    name: string
    slug: string
    images: image[]
}

interface ProductSectionProps {
    products: Product[]
    categoryName: string
}

const ProductSection: React.FC<ProductSectionProps> = ({
    products,
    categoryName,
}) => {
    return (
        <Carousel opts={{ align: 'start' }} className="h-full">
            <CarouselContent>
                {products &&
                    products.map((product) => (
                        <CarouselItem
                            key={product.id}
                            className="relative basis-1/2 md:basis-1/3"
                        >
                            <div className="relative overflow-hidden rounded-xl">
                                <Image
                                    className="aspect-[3/3.5] w-full transform overflow-hidden rounded-xl object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                                    src={
                                        product.images.length !== 0
                                            ? product.images[0].image_url
                                            : 'https://via.placeholder.com/200x250?text=No+Image'
                                    }
                                    width={200}
                                    height={400}
                                    alt={product.name}
                                />
                                <div className="group absolute bottom-8 left-0 md:left-4">
                                    <Link href={`/products/${product.slug}`}>
                                        <Badge className="rounded-s-md bg-white px-2 py-2 text-sm text-black hover:bg-black hover:text-white md:rounded-sm md:px-4 md:py-3">
                                            {product.name}
                                            <ArrowDownRight className="ml-2 hidden h-4 w-4 -rotate-90 group-hover:block" />
                                        </Badge>
                                    </Link>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
            </CarouselContent>
            <CarouselPrevious className="absolute right-10 top-[-30px] z-10 ring-1 ring-black disabled:ring-gray-500 md:left-0" />
            <CarouselNext className="absolute right-0 top-[-30px] z-10 ring-1 ring-black disabled:ring-gray-500 md:left-10" />
            <span className="absolute left-0 top-[-42px] z-10 font-bold uppercase md:left-[90px]">
                SHOP BY {categoryName}
            </span>
        </Carousel>
    )
}

export default ProductSection
