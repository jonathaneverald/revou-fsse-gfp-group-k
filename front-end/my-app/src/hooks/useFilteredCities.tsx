import { useState, useMemo } from "react";

export const useFilteredCities = (cities: string[]) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [showAll, setShowAll] = useState(false);

	const filteredCities = useMemo(() => {
		return cities.filter((city) => city.toLowerCase().includes(searchTerm.toLowerCase()));
	}, [cities, searchTerm]);

	const visibleCities = showAll ? filteredCities : filteredCities.slice(0, 5);

	const toggleShowAll = () => setShowAll(!showAll);

	return {
		citySearchTerm: searchTerm,
		setCitySearchTerm: setSearchTerm,
		showAllCities: showAll,
		toggleShowAllCities: toggleShowAll,
		filteredCities,
		visibleCities,
	};
};
