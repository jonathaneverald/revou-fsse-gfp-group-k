import React from "react";
import { Input } from "../ui/input";
import { useFilteredCities } from "@/hooks/useFilteredCities";
import { useFetchCities } from "@/hooks/useFetchCities";
import { useRouter } from "next/router";
import SidebarItemLoading from "../loading/SidebarCategoryLoading";

const Cities: React.FC = () => {
	const router = useRouter();
	const { query } = router;
	const city = Array.isArray(query.location) ? query.location[0] : query.location || "";

	const { cities, isLoading, error } = useFetchCities();

	const { citySearchTerm, setCitySearchTerm, showAllCities, toggleShowAllCities, visibleCities, filteredCities } =
		useFilteredCities(cities);

	const getCityClassName = (cat: string) => `
    mx-2 p-2 capitalize rounded-md text-sm font-medium hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer my-1
    ${cat.toLowerCase() === city.toLowerCase() ? "bg-emerald-50 text-emerald-700" : "text-gray-700"}
  `;

	const handleCityClick = (cit: string) => {
		const newQuery: Record<string, string> = { ...query, page: "1" };

		if (cit === city) {
			delete newQuery.location;
		} else {
			newQuery.location = cit;
		}

		router.push({
			pathname: "/products",
			query: newQuery,
		});
	};

	if (isLoading) return <SidebarItemLoading type="Cities" />;

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
				<div key={index} className={getCityClassName(city.slug)} onClick={() => handleCityClick(city.slug)}>
					<span>{city.city}</span>
				</div>
			))}
			{filteredCities.length > 5 && (
				<div
					className="mx-2 p-2 rounded-md text-sm font-medium cursor-pointer my-1"
					onClick={toggleShowAllCities}
				>
					{showAllCities ? "Show Less" : "Show More"}
				</div>
			)}
		</>
	);
};

export default Cities;
