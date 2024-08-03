import React, { useState } from "react";
import { useRouter } from "next/router";

const productCategories = [
	"Electronics",
	"Home Appliances",
	"Furniture",
	"Clothing",
	"Beauty and Personal Care",
	"Health and Wellness",
	"Books",
	"Toys",
	"Sports Equipment",
	"Automotive",
	"Gardening",
	"Pet Supplies",
	"Groceries",
	"Office Supplies",
	"Music Instruments",
	"Movies and TV",
	"Video Games",
	"Jewelry",
	"Watches",
	"Bags and Luggage",
	"Outdoor Gear",
	"Kitchenware",
	"Cleaning Supplies",
	"Baby Products",
	"Tools and Hardware",
	"Art Supplies",
	"Craft Supplies",
	"Building Materials",
	"Stationery",
	"Lighting",
];

const citiesInIndonesia = [
	"Jakarta",
	"Surabaya",
	"Bandung",
	"Medan",
	"Bekasi",
	"Depok",
	"Tangerang",
	"Makassar",
	"Semarang",
	"Palembang",
	"South Tangerang",
	"Batam",
	"Pekanbaru",
	"Bogor",
	"Denpasar",
	"Malang",
	"Padang",
	"Samarinda",
	"Tasikmalaya",
	"Banjarmasin",
];

const Sidebar: React.FC = () => {
	const { query } = useRouter();
	const category = Array.isArray(query.category) ? query.category[0] : query.category || "";
	const [showAllCategories, setShowAllCategories] = useState(false);
	const [showAllCities, setShowAllCities] = useState(false);

	const visibleCategories = showAllCategories ? productCategories : productCategories.slice(0, 5);
	const visibleCities = showAllCities ? citiesInIndonesia : citiesInIndonesia.slice(0, 5);

	const getCategoryClassName = (cat: string) => `
    mx-2 p-2 rounded-md text-sm font-medium hover:bg-gray-100 hover:text-emerald-600 cursor-pointer my-1
    ${cat.toLowerCase() === category.toLowerCase() ? "bg-gray-100 text-emerald-600" : "text-gray-700"}
  `;

	const toggleShowAllCategories = () => setShowAllCategories(!showAllCategories);
	const toggleShowAllCities = () => setShowAllCities(!showAllCities);

	return (
		<div className="border md:block hidden shadow-md my-5 rounded-md bg-white py-6 px-3 overflow-y-auto">
			<div className="mx-2 text-sm font-bold my-2">
				<span>Category</span>
			</div>
			{visibleCategories.map((cat, index) => (
				<div key={index} className={getCategoryClassName(cat)}>
					<span>{cat}</span>
				</div>
			))}
			<div
				className="mx-2 p-2 rounded-md text-sm font-medium text-emerald-600 cursor-pointer my-1"
				onClick={toggleShowAllCategories}
			>
				{showAllCategories ? "Show Less" : "Show More"}
			</div>

			<div className="mx-2 text-sm font-bold my-2 mt-6">
				<span>Cities</span>
			</div>
			{visibleCities.map((city, index) => (
				<div
					key={index}
					className="mx-2 p-2 rounded-md text-sm font-medium hover:bg-gray-100 hover:text-emerald-600 cursor-pointer my-1 text-gray-700"
				>
					<span>{city}</span>
				</div>
			))}
			<div
				className="mx-2 p-2 rounded-md text-sm font-medium text-emerald-600 cursor-pointer my-1"
				onClick={toggleShowAllCities}
			>
				{showAllCities ? "Show Less" : "Show More"}
			</div>
		</div>
	);
};

export default Sidebar;
