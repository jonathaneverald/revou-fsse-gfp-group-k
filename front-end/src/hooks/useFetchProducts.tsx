import { getToken } from "@/utils/tokenUtils";
import useSWR from "swr";

const fetcher = async (url: string) => {
	const token = getToken();
	return await fetch(url, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}).then((res) => res.json());
};

const useFetchProducts = (page: number, per_page: number, category?: string, city?: string, q?: string) => {
	const url = `http://127.0.0.1:5000/product?page=${page}&per_page=${per_page}&category=${category}&city=${city}&q=${q}`;

	const { data, error } = useSWR(url, fetcher);

	return {
		products: data?.data,
		isLoading: !error && !data,
		isError: error,
	};
};

export default useFetchProducts;
