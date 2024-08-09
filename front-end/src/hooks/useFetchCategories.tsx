import { ApiResponseCategoy, Category } from "@/types/category";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// const fetcher = async (url: string) => {
// 	await new Promise((resolve) => setTimeout(resolve, 5000));
// 	const response = await fetch(url);
// 	return response.json();
// };
export const useFetchCategories = () => {
	const { data, error } = useSWR<ApiResponseCategoy, Error>("http://127.0.0.1:5000/category", fetcher);

	const categories = data && data.message === "Success" ? data.data.map((category: Category) => category.name) : [];

	return {
		categories,
		isLoading: !error && !data,
		error: error || (data && data.message !== "Success" ? "Failed to fetch categories" : null),
	};
};
