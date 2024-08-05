import React from "react";
import { Input } from "../ui/input";
import { useFilteredCities } from "@/hooks/useFilteredCities";
import { useFetchCities } from "@/hooks/useFetchCities";
import { useRouter } from "next/router";

const Cities: React.FC = () => {
	const { query } = useRouter();
	const city = Array.isArray(query.city) ? query.city[0] : query.city || "";

	const { cities, isLoading, error } = useFetchCities();

	const { citySearchTerm, setCitySearchTerm, showAllCities, toggleShowAllCities, visibleCities, filteredCities } =
		useFilteredCities(cities);

	const getCityClassName = (cat: string) => `
    mx-2 p-2 capitalize rounded-md text-sm font-medium hover:bg-gray-100 hover:text-emerald-600 cursor-pointer my-1
    ${cat.toLowerCase() === city.toLowerCase() ? "bg-gray-50 text-emerald-600" : "text-gray-700"}
  `;

	if (isLoading) return <div>Loading...</div>;

	if (error) return <div>Error: {error instanceof Error ? error.message : String(error)}</div>;

	return (
		<>
			<div className="mx-2 text-sm font-bold my-2 mt-6">
				<span>Cities</span>
			</div>
			<div className="mb-4 mx-2">
				<Input
					type="text"
					placeholder="Search cities..."
					value={citySearchTerm}
					onChange={(e) => setCitySearchTerm(e.target.value)}
				/>
			</div>
			{visibleCities.map((city, index) => (
				<div key={index} className={getCityClassName(city)}>
					<span>{city}</span>
				</div>
			))}
			{filteredCities.length > 5 && (
				<div
					className="mx-2 p-2 rounded-md text-sm font-medium text-emerald-600 cursor-pointer my-1"
					onClick={toggleShowAllCities}
				>
					{showAllCities ? "Show Less" : "Show More"}
				</div>
			)}
		</>
	);
};

export default Cities;
