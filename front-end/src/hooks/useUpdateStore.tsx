import { useState } from 'react'
import { getToken } from '@/utils/tokenUtils'
import { mutate } from 'swr'

const useUpdateStore = () => {
    const [isUpdating, setIsUpdating] = useState(false)
    const [errorUpdating, setErrorUpdating] = useState<string | null>(null)

    const updateStore = async (
        id: number,
        newName: string,
        newLocation: string
    ): Promise<boolean> => {
        setIsUpdating(true)
        setErrorUpdating(null)

        try {
            const token = getToken()
            const response = await fetch(
                `http://127.0.0.1:5000/seller-profile/${id}`,
                {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: newName,
                        city_location: newLocation,
                    }),
                }
            )

            if (!response.ok) {
                throw new Error('Failed to update store profile')
            }

            // Trigger a revalidation of the seller profile data
            await mutate(`http://127.0.0.1:5000/seller-profile`)
            return true
        } catch (err) {
            setErrorUpdating(
                err instanceof Error
                    ? err.message
                    : 'Failed to update store profile'
            )
            return false
        } finally {
            setIsUpdating(false)
        }
    }
    return { updateStore, isUpdating, errorUpdating }
}

export default useUpdateStore
