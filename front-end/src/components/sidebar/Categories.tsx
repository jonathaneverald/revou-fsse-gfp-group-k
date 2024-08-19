import React from "react";
import { Input } from "../ui/input";
import { useFilteredCategories } from "@/hooks/useFilteredCategories";
import { useRouter } from "next/router";
import { useFetchCategories } from "@/hooks/useFetchCategories";
import SidebarItemLoading from "../loading/SidebarCategoryLoading";

const Categories: React.FC = () => {
	const router = useRouter();
	const { query } = router;
	const category = Array.isArray(query.category) ? query.category[0] : query.category || "";

	const { categories, isLoading, error } = useFetchCategories();

	const { categorySearchTerm, setCategorySearchTerm, showAllCategories, toggleShowAllCategories, visibleCategories } =
		useFilteredCategories(categories);

	const getCategoryClassName = (cat: string) => `
    mx-2 p-2 capitalize rounded-md text-sm font-medium hover:bg-gray-100 hover:text-emerald-600 cursor-pointer my-1
    ${cat.toLowerCase() === category.toLowerCase() ? "bg-gray-100 text-emerald-600" : "text-gray-700"}
  `;

	const handleCategoryClick = (cat: string) => {
		const newQuery: Record<string, string> = { ...query, page: "1" };

		if (cat === category) {
			delete newQuery.category;
		} else {
			newQuery.category = cat;
		}

		router.push({
			pathname: "/products",
			query: newQuery,
		});
	};

	if (isLoading) return <SidebarItemLoading type="Category" />;

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
				<div
					key={index}
					className={getCategoryClassName(cat.slug)}
					onClick={() => handleCategoryClick(cat.slug)}
				>
					<span>{cat.name}</span>
				</div>
			))}
			{categories.length > 5 && (
				<div
					className="mx-2 p-2 rounded-md text-sm font-medium cursor-pointer my-1"
					onClick={toggleShowAllCategories}
				>
					{showAllCategories ? "Show Less" : "Show More"}
				</div>
			)}
		</>
	);
};

export default Categories;
