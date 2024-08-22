import { useState, useEffect } from 'react'
import axios from 'axios'
import { getToken } from '@/utils/tokenUtils'

export interface Voucher {
    voucher_name: string
    discount: string
    seller_id: number
    seller_name: string
    voucher_id: number
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
                const response = await axios.get(
                    'http://127.0.0.1:5000/cart/vouchers/',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                console.log(response)

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
