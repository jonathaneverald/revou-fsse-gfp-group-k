import { useRouter } from 'next/router'
import { User } from '@/types/user'
import { getToken, removeToken } from '@/utils/tokenUtils'
import { useAppDispatch, useAppSelector } from './reduxHooks'
import { setUserData, setLoading } from '../store/userSlice'
import { useEffect, useCallback, useRef } from 'react'

const useUserProfile = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { data: user, loading, error } = useAppSelector((state) => state.user)
    const fetchedRef = useRef(false)

    const fetchUserData = useCallback(async () => {
        if (fetchedRef.current) return
        fetchedRef.current = true

        dispatch(setLoading(true))
        try {
            const token = getToken()

            const response = await fetch('http://127.0.0.1:5000/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                removeToken()
                console.log(response)
                return
            }

            const data = await response.json()

            if (data.msg === 'Token has expired') {
                removeToken()
                console.log(data)
                return
            }

            dispatch(setUserData(data.data))
        } catch (err) {
            console.log(err)
        } finally {
            dispatch(setLoading(false))
        }
    }, [dispatch, router])

    useEffect(() => {
        if (!loading && !user) {
            fetchUserData()
        }
    }, [loading, user])

    return { user: user as User, error, isLoading: loading, fetchUserData }
}

export default useUserProfile
