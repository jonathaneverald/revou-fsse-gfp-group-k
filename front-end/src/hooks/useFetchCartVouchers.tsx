import { useState, useEffect } from 'react'
import axios from 'axios'
import { getToken } from '@/utils/tokenUtils'

export interface Voucher {
    id: number
    code: string
    description: string
    discount: string
    seller_id: number
}

export const useFetchCartVouchers = () => {
    const [vouchers, setVouchers] = useState<Voucher[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchVouchers = async () => {
            setLoading(true)
            setError(null)

            try {
                const token = getToken()
                const response = await axios.get('/cart/vouchers/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                setVouchers(response.data.data) // Assuming the API response has a 'data' field
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchVouchers()
    }, [])

    return { vouchers, loading, error }
}
