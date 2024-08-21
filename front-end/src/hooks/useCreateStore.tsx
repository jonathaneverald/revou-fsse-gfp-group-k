import { useState } from 'react'
import { getToken } from '@/utils/tokenUtils'
import axios from 'axios'

type StoreData = {
    name: string
    city_location: string
}

const useCreateStore = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<boolean>(false)

    const createStore = async (storeData: StoreData) => {
        setIsLoading(true)
        setError(null)
        setSuccess(false)
        const token = getToken()
        if (!token) {
            setError('Authentication token not found. Please login again.')
            setIsLoading(false)
            return null
        }

        try {
            const response = await axios.post(
                'http://127.0.0.1:5000/seller',
                storeData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            setSuccess(true)
            return response.data
        } catch (err) {
            setError('Failed to create store. Please try again.')
            return null
        } finally {
            setIsLoading(false)
        }
    }
    return { createStore, isLoading, error, success }
}

export default useCreateStore
