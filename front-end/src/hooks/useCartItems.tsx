import { getToken } from '@/utils/tokenUtils'
import useSWR from 'swr'

const fetcher = async (url: string) => {
    const token = getToken()
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    const result = await response.json()

    return result.data
}

export const useCartItems = () => {
    const { data, isLoading, error } = useSWR(
        'http://127.0.0.1:5000/cart',
        fetcher
    )

    return {
        cartItems: data,
        isLoading: isLoading,
        isError: error,
    }
}
