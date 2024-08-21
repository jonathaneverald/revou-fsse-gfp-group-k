import { useState } from 'react'
import { getToken } from '@/utils/tokenUtils'
import { mutate } from 'swr'

export const useUpdateProfile = () => {
    const [isUpdating, setIsUpdating] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const updateProfile = async (
        newName: string,
        newAddress: string,
        newPhone: string
    ) => {
        setIsUpdating(true)
        setError(null)

        try {
            const token = getToken()
            const response = await fetch('http://127.0.0.1:5000/profile', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newName,
                    address: newAddress,
                    phone_number: newPhone,
                }),
            })

            if (!response.ok) {
                const responseData = await response.json()
                console.error('Server responded with:', responseData)
                throw new Error('Failed to update profile')
            }

            // Trigger a revalidation of the cart data
            await mutate('http://127.0.0.1:5000/profile')
            setIsUpdating(false)
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Failed to update profile!'
            )
            setIsUpdating(false)
        }
    }
    return { updateProfile, isUpdating, error }
}
