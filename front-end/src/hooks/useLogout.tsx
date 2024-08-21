import { useState } from 'react'
import { useRouter } from 'next/router'
import { getToken, removeToken } from '@/utils/tokenUtils'

const useLogout = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleLogout = async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch('http://127.0.0.1:5000/logout', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                credentials: 'include', // Include cookies if needed
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message || 'Logout failed')
            }

            removeToken() // Remove the token from cookies

            setTimeout(() => {
                router.push('/login')
            }, 2000)
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : 'An unexpected error occurred'
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return {
        handleLogout,
        loading,
        error,
    }
}

export default useLogout
