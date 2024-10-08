import { ApiResponse, City } from '@/types/city'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// const fetcher = async (url: string) => {
// 	await new Promise((resolve) => setTimeout(resolve, 5000));
// 	const response = await fetch(url);
// 	return response.json();
// };

export const useFetchCities = () => {
    const { data, error } = useSWR<ApiResponse, Error>(
        'http://127.0.0.1:5000/location',
        fetcher
    )

    const cities =
        data && data.message === 'Success'
            ? data.data.map((city: City) => city)
            : []

    return {
        cities,
        isLoading: !error && !data,
        error:
            error ||
            (data && data.message !== 'Success'
                ? 'Failed to fetch cities'
                : null),
    }
}
