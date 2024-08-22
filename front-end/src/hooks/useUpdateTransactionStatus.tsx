import { useState } from 'react'
import axios from 'axios'
import { getToken } from '@/utils/tokenUtils'
import { mutate } from 'swr'

interface UpdateTransactionResponse {
    message: string
    status: number
}

const useUpdateTransactionStatus = () => {
    const [isUpdating, setIsUpdating] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const updateTransactionStatus = async (
        transactionId: number,
        newStatus: string
    ): Promise<UpdateTransactionResponse | null> => {
        setIsUpdating(true)
        setError(null)

        try {
            const token = getToken()
            const payload = { status: newStatus }
            console.log('Payload:', payload)

            const response = await axios.put(
                `http://127.0.0.1:5000/transaction/${transactionId}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            )

            await mutate('http://127.0.0.1:5000/transaction')
            setIsUpdating(false)
            return response.data
        } catch (err: any) {
            setError(
                err.response?.data?.message || 'Failed to update transaction!'
            )
            setIsUpdating(false)
            return null
        }
    }

    return { updateTransactionStatus, isUpdating, error }
}

export default useUpdateTransactionStatus
