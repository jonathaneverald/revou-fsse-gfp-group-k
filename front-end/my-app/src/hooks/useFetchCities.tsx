import { useState, useEffect } from "react";

interface City {
	city: string;
	id: number;
	slug: string;
}

export const useFetchCities = () => {
	const [cities, setCities] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchCities = async () => {
			try {
				const response = await fetch("http://127.0.0.1:5000/location");
				const data = await response.json();
				if (data.message === "Success") {
					setCities(data.data.map((city: City) => city.city));
				} else {
					setError("Failed to fetch cities");
				}
			} catch (error) {
				setError("Error fetching cities");
			} finally {
				setIsLoading(false);
			}
		};

		fetchCities();
	}, []);

	return { cities, isLoading, error };
};
