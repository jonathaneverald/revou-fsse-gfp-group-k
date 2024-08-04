import ProductCard from "@/components/card/ProductCard";
import Sidebar from "@/components/layouts/Sidebar";
import React from "react";

const Products = () => {
	const productList = [
		{
			image: "https://images.unsplash.com/photo-1518843875459-f738682238a6",
			name: "Strawberry",
			slug: "strawberry",
			originalPrice: 85000,
		},
		{
			image: "https://images.unsplash.com/photo-1587132137056-bfbf0166836e",
			name: "Asparagus",
			slug: "asparagus",
			originalPrice: 120000,
		},
		{
			image: "https://images.unsplash.com/photo-1550828520-4cb496926fc9",
			name: "Carrot",
			slug: "carrot",
			originalPrice: 50000,
		},
		{
			image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb",
			name: "Avocado",
			slug: "avocado",
			originalPrice: 150000,
		},
		{
			image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2",
			name: "Broccoli",
			slug: "broccoli",
			originalPrice: 75000,
		},
		{
			image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba",
			name: "Blueberry",
			slug: "blueberry",
			originalPrice: 95000,
		},
		{
			image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224",
			name: "Bell Pepper",
			slug: "bell-pepper",
			originalPrice: 65000,
		},
		{
			image: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e",
			name: "Cucumber",
			slug: "cucumber",
			originalPrice: 55000,
		},
		{
			image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b",
			name: "Spinach",
			slug: "spinach",
			originalPrice: 70000,
		},
		{
			image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf",
			name: "Potato",
			slug: "potato",
			originalPrice: 45000,
		},
		{
			image: "https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e",
			name: "Garlic",
			slug: "garlic",
			originalPrice: 40000,
		},
		{
			image: "https://images.unsplash.com/photo-1587411768638-ec71f8e33b78",
			name: "Onion",
			slug: "onion",
			originalPrice: 35000,
		},
		{
			image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5",
			name: "Eggplant",
			slug: "eggplant",
			originalPrice: 80000,
		},
		{
			image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37",
			name: "Lettuce",
			slug: "lettuce",
			originalPrice: 60000,
		},
		{
			image: "https://images.unsplash.com/photo-1579705745811-a32bef7856a3",
			name: "Cauliflower",
			slug: "cauliflower",
			originalPrice: 90000,
		},
		{
			image: "https://images.unsplash.com/photo-1582284540020-8acbe03f4924",
			name: "Cabbage",
			slug: "cabbage",
			originalPrice: 55000,
		},
		{
			image: "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f",
			name: "Radish",
			slug: "radish",
			originalPrice: 45000,
		},
		{
			image: "https://images.unsplash.com/photo-1524179091875-bf99a9a6af57",
			name: "Kale",
			slug: "kale",
			originalPrice: 75000,
		},
		{
			image: "https://images.unsplash.com/photo-1587334207810-755c3608d503",
			name: "Zucchini",
			slug: "zucchini",
			originalPrice: 70000,
		},
		{
			image: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e",
			name: "Pumpkin",
			slug: "pumpkin",
			originalPrice: 110000,
		},
	];

	return (
		<div className="mx-4 md:container bg-gray-50">
			<div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
				<div className="w-full hidden md:flex">
					<Sidebar />
				</div>
				<div className="md:col-span-2 lg:col-span-3">
					<div className="my-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
						{productList.map((product, index) => (
							<ProductCard key={index} {...product} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Products;
