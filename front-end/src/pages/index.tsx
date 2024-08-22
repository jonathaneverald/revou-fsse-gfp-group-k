import ProductSection from '@/components/carousel/ProductSection'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'
import axios from 'axios'
import {
    ArrowDownRight,
    ArrowUpRight,
    ChevronRight,
    MoveUpRight,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Category {
    id: number
    name: string
    slug: string
    products: Product[]
}

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

interface CategoryResponse {
    data: Category[]
    message: string
}

export default function Home() {
    const [categories, setCategories] = useState<Category[]>([])

    const fetchCategories = async (): Promise<Category[]> => {
        try {
            const response = await axios.get<CategoryResponse>(
                'http://127.0.0.1:5000/category'
            )
            return response.data.data
        } catch (error) {
            console.error('Error fetching categories:', error)
            return []
        }
    }

    useEffect(() => {
        const loadCategories = async () => {
            const fetchedCategories = await fetchCategories()
            setCategories(fetchedCategories)
        }

        loadCategories()
    }, [])

    return (
        <div>
            <section className="bg-[#f7f6f2]">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="flex flex-col justify-center p-5 py-10 text-center md:text-left lg:px-20 lg:py-20">
                        <h1 className="mb-4 text-4xl lg:text-6xl">
                            Our Biggest Event of the Season
                        </h1>
                        <p className="mb-6 text-lg font-semibold">
                            Kick off Summer with 10% off sitewide.*
                        </p>

                        <Link href={'/products'}>
                            <Button size={'lg'} className="h-12">
                                Shop collection
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                    <div className="hidden w-full md:block">
                        <Image
                            src="https://themesflat.co/html/ecomus/images/slider/kitchen-wear-1.jpg"
                            alt="Tableware"
                            width={700}
                            height={700}
                        />
                    </div>
                </div>
            </section>

            {categories.slice(5, 7).map((category) => (
                <section
                    key={category.id}
                    className="grid gap-4 bg-white px-4 py-20 md:grid-cols-4 md:px-6"
                >
                    <div className="relative md:col-span-4 lg:col-span-3">
                        <ProductSection
                            products={category.products}
                            categoryName={category.name}
                        />
                    </div>
                    <div className="flex items-center md:hidden lg:flex">
                        <Card className="flex h-full w-full flex-row items-center justify-between border border-black p-2 md:flex-col md:items-start md:justify-end md:p-10">
                            <h3 className="text-xl md:text-3xl">
                                Discover all new items
                            </h3>
                            <div className="group md:mt-5">
                                <Link
                                    href={`/products?category=${category.slug}`}
                                >
                                    <Button
                                        size={'icon'}
                                        className="h-8 w-8 rounded-full border border-black bg-white group-hover:bg-black md:h-12 md:w-12"
                                    >
                                        <ArrowUpRight className="text-black group-hover:text-white" />
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    </div>
                </section>
            ))}
        </div>
    )
}
