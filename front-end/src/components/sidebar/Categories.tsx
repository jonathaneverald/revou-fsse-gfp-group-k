import React from "react";
import { Input } from "../ui/input";
import { useFilteredCategories } from "@/hooks/useFilteredCategories";
import { useRouter } from "next/router";
import { useFetchCategories } from "@/hooks/useFetchCategories"; // Import the new hook

const Categories: React.FC = () => {
	const { query } = useRouter();
	const category = Array.isArray(query.category) ? query.category[0] : query.category || "";

	const { categories, isLoading, error } = useFetchCategories();

	const { categorySearchTerm, setCategorySearchTerm, showAllCategories, toggleShowAllCategories, visibleCategories } =
		useFilteredCategories(categories);

	const getCategoryClassName = (cat: string) => `
    mx-2 p-2 capitalize rounded-md text-sm font-medium hover:bg-gray-100 hover:text-emerald-600 cursor-pointer my-1
    ${cat.toLowerCase() === category.toLowerCase() ? "bg-gray-100 text-emerald-600" : "text-gray-700"}
  `;

	if (isLoading) return <div>Loading categories...</div>;

	if (error) return <div>Error: {error instanceof Error ? error.message : String(error)}</div>;

	return (
		<>
			<div className="mx-2 text-sm font-bold my-2">
				<span>Category</span>
			</div>
			<div className="mb-4 mx-2">
				<Input
					type="text"
					placeholder="Search categories..."
					value={categorySearchTerm}
					onChange={(e) => setCategorySearchTerm(e.target.value)}
				/>
			</div>
			{visibleCategories.map((cat, index) => (
				<div key={index} className={getCategoryClassName(cat)}>
					<span>{cat}</span>
				</div>
			))}
			{categories.length > 5 && (
				<div
					className="mx-2 p-2 rounded-md text-sm font-medium text-emerald-600 cursor-pointer my-1"
					onClick={toggleShowAllCategories}
				>
					{showAllCategories ? "Show Less" : "Show More"}
				</div>
			)}
		</>
	);
};

export default Categories;
