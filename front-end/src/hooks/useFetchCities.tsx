import useSWR from "swr";

interface City {
	city: string;
	id: number;
	slug: string;
}

interface ApiResponse {
	message: string;
	data: City[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useFetchCities = () => {
	const { data, error } = useSWR<ApiResponse, Error>("http://127.0.0.1:5000/location", fetcher);

	const cities = data && data.message === "Success" ? data.data.map((city: City) => city.city) : [];

	return {
		cities,
		isLoading: !error && !data,
		error: error || (data && data.message !== "Success" ? "Failed to fetch cities" : null),
	};
};
