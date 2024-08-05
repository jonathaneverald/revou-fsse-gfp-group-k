import useSWR from "swr";

interface Category {
	id: number;
	name: string;
	slug: string;
}

interface ApiResponse {
	message: string;
	data: Category[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useFetchCategories = () => {
	const { data, error } = useSWR<ApiResponse, Error>("http://127.0.0.1:5000/category", fetcher);

	const categories = data && data.message === "Success" ? data.data.map((category: Category) => category.name) : [];

	return {
		categories,
		isLoading: !error && !data,
		error: error || (data && data.message !== "Success" ? "Failed to fetch categories" : null),
	};
};
