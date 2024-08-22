import { getToken } from '@/utils/tokenUtils'
import axios from 'axios'
import useSWR from 'swr'
import { useState, useEffect } from 'react'

interface Product {
    price: number
    product_name: string
    quantity: number
}

interface Transaction {
    discount: number | null
    id: number
    products: Product[]
    status: string
    total_price: number
    voucher_applied: null
    user: {
        address: string
        phone_number: string
        user_id: number
        user_name: string
    }
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

export function useTransactionSeller() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const { data, error, isLoading } = useSWR<ApiResponse>(
        'http://127.0.0.1:5000/transaction-seller',
        fetcher
    )

    // Populate transactions state when data is fetched
    useEffect(() => {
        if (data) {
            setTransactions(data.data)
        }
    }, [data])

    return {
        transactions, // Use the state variable here
        setTransactions, // Return the setter function as well
        message: data?.message,
        isLoading: isLoading,
        isError: error,
    }
}
