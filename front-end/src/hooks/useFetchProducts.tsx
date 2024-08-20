import { getToken } from '@/utils/tokenUtils'
import useSWR from 'swr'
import useDebounce from './useDebounce'

type FetchProductsParams = {
    page: number
    per_page: number
    category?: string
    location?: string
    product_name?: string
}

const fetcher = async (url: string) => {
    const token = getToken()
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    return response.json()
}

const buildUrl = (params: FetchProductsParams): string => {
    const {
        page,
        per_page,
        category = '',
        location = '',
        product_name = '',
    } = params

    const queryParams = new URLSearchParams({
        page: page.toString(),
        per_page: per_page.toString(),
        category,
        location,
        product_name,
    })

    return `http://127.0.0.1:5000/product?${queryParams.toString()}`
}

const useFetchProducts = (params: FetchProductsParams) => {
    const debouncedParams = useDebounce(params, 300)

    const url = buildUrl(debouncedParams)
    const { data, isLoading, error } = useSWR(url, fetcher)

    return {
        products: data?.data,
        isLoading: isLoading,
        isError: error,
    }
}

export default useFetchProducts
