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

const useFetchProducts = ({
	page,
	per_page,
	category = "",
	location = "",
	product_name = "",
}: {
	page: number;
	per_page: number;
	category?: string;
	location?: string;
	product_name?: string;
}) => {
	const params = new URLSearchParams({
		page: page.toString(),
		per_page: per_page.toString(),
		category,
		location,
		product_name,
	}).toString();

	const url = `http://127.0.0.1:5000/product?${params}`;

	const { data, error } = useSWR(url, fetcher);

	return {
		products: data?.data,
		isLoading: !error && !data,
		isError: error,
	};
};

export default useFetchProducts;
