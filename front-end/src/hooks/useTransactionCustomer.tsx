import useSWR from 'swr'
import { getToken } from '@/utils/tokenUtils'
import axios from 'axios'

interface Product {
    price: string
    product_name: string
    quantity: number
}

interface User {
    user_name: string
    address: string
    phone_number: string
}

interface SellerProfile {
    address: string
    email: string
    name: string
    phone_number: string
    user_id: number
}

interface Seller {
    id: number
    profile: SellerProfile
    slug: string
    store: string
}

interface Transaction {
    id: number
    discount: string
    products: Product[]
    status: string
    total_price: string
    voucher_applied: string | null
    user: User
    seller: Seller
}

interface ApiResponse {
    data: Transaction[]
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

export function useTransactionCustomer() {
    const { data, error, isLoading } = useSWR<ApiResponse>(
        'http://127.0.0.1:5000/transaction', // Key for customer transactions
        fetcher
    )

    return {
        transactions: data?.data || [],
        message: data?.message,
        isLoading,
        isError: error,
    }
}
