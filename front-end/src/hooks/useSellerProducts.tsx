import { getToken } from '@/utils/tokenUtils'
import axios from 'axios'
import useSWR from 'swr'

interface Product {
    id: number
    images: string[] | null
    name: string
    price: number
    quantity: number
    slug: string
    type: string
}

interface ApiResponse {
    data: Product[]
    message: string
}

const fetcher = async (url: string) => {
    const token = getToken()
    const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    return response.data
}

export function useSellerProducts() {
    const { data, error, isLoading, mutate } = useSWR<ApiResponse>(
        'http://127.0.0.1:5000/seller/products',
        fetcher
    )
    console.log(data)

    return {
        products: data?.data || [],
        message: data?.message,
        isLoading,
        isError: error,
        mutate,
    }
}
