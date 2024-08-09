import { Category } from "@/types/category";
import { useState, useMemo } from "react";

export const useFilteredCategories = (categories: Category[]) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [showAll, setShowAll] = useState(false);

	const filteredCategories = useMemo(() => {
		return categories.filter((category) => category.name.toLowerCase().includes(searchTerm.toLowerCase()));
	}, [categories, searchTerm]);

	const visibleCategories = showAll ? filteredCategories : filteredCategories.slice(0, 5);

	const toggleShowAll = () => setShowAll(!showAll);

	return {
		categorySearchTerm: searchTerm,
		setCategorySearchTerm: setSearchTerm,
		showAllCategories: showAll,
		toggleShowAllCategories: toggleShowAll,
		filteredCategories,
		visibleCategories,
	};
};
