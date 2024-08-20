import { useState } from 'react'
import { SubmitHandler } from 'react-hook-form'

type RegisterFormData = {
    name: string
    email: string
    password: string
    address: string
    phone_number: string
}

const useRegister = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<boolean>(false)

    const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
            const response = await fetch('http://127.0.0.1:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const result = await response.json()
                throw new Error(result.message || 'Registration failed')
            }

            setSuccess(true)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return {
        onSubmit,
        loading,
        error,
        success,
    }
}

export default useRegister
