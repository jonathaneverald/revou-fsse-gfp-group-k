import { LoginResponse } from '@/types/login'
import { useState } from 'react'
import { SubmitHandler } from 'react-hook-form'

type LoginFormData = {
    email: string
    password: string
}

const useLogin = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch('http://127.0.0.1:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            const result: LoginResponse = await response.json()

            if (!response.ok) {
                throw new Error(result.message || 'Login failed')
            }

            return result
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
        onSubmit,
        loading,
        error,
    }
}

export default useLogin
