import { getToken } from '@/utils/tokenUtils'
import axios from 'axios'

interface Transaction {
    id: number
    amount: number
    description: string
}

interface TransactionResponse {
    data: Transaction
    message: string
}

const API_ENDPOINT = 'http://127.0.0.1:5000/transaction'

export function useTransactionPost() {
    const postTransaction = async (
        voucher_id: number | null
    ): Promise<TransactionResponse> => {
        try {
            const token = getToken()

            const payload: { voucher_id?: number } = {}

            if (voucher_id !== null) {
                payload.voucher_id = voucher_id
            }

            const response = await axios.post(API_ENDPOINT, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            return response.data
        } catch (error) {
            console.error('Error posting transaction:', error)
            throw error
        }
    }

    return { postTransaction }
}
