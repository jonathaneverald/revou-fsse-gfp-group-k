import { useState, useCallback } from "react";
import { City } from "@/types/city";

export const useCities = () => {
	const [cities, setCities] = useState<City[]>([]);

	const fetchCities = useCallback(async () => {
		try {
			const response = await fetch("http://127.0.0.1:5000/location");
			const data = await response.json();
			setCities(data.data);
		} catch (error) {
			console.error("Error fetching cities:", error);
		}
	}, []);

	return { cities, fetchCities };
};
