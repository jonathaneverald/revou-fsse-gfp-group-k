import ProductCard from "@/components/card/ProductCard";
import Sidebar from "@/components/layouts/Sidebar";
import React from "react";

const Products = () => {
	const productList = [
		{
			image: "https://pickbazar-react-rest.vercel.app/_next/image?url=https%3A%2F%2Fpickbazarlaravel.s3.ap-southeast-1.amazonaws.com%2F1%2FApples.jpg&w=2048&q=75",
			name: "Tomato",
			slug: "tomato",
			originalPrice: 100000,
		},
		{
			image: "https://pickbazar-react-rest.vercel.app/_next/image?url=https%3A%2F%2Fpickbazarlaravel.s3.ap-southeast-1.amazonaws.com%2F1%2FBananas.jpg&w=2048&q=75",
			name: "Banana",
			slug: "banana",
			originalPrice: 150000,
		},
		{
			image: "https://pickbazar-react-rest.vercel.app/_next/image?url=https%3A%2F%2Fpickbazarlaravel.s3.ap-southeast-1.amazonaws.com%2F1%2FCherries.jpg&w=2048&q=75",
			name: "Cherry",
			slug: "cherry",
			originalPrice: 200000,
		},
		{
			image: "https://pickbazar-react-rest.vercel.app/_next/image?url=https%3A%2F%2Fpickbazarlaravel.s3.ap-southeast-1.amazonaws.com%2F1%2FDates.jpg&w=2048&q=75",
			name: "Date",
			slug: "date",
			originalPrice: 250000,
		},
		{
			image: "https://pickbazar-react-rest.vercel.app/_next/image?url=https%3A%2F%2Fpickbazarlaravel.s3.ap-southeast-1.amazonaws.com%2F1%2FDates.jpg&w=2048&q=75",
			name: "Date",
			slug: "date",
			originalPrice: 250000,
		},
		{
			image: "https://pickbazar-react-rest.vercel.app/_next/image?url=https%3A%2F%2Fpickbazarlaravel.s3.ap-southeast-1.amazonaws.com%2F1%2FDates.jpg&w=2048&q=75",
			name: "Date",
			slug: "date",
			originalPrice: 250000,
		},
		{
			image: "https://pickbazar-react-rest.vercel.app/_next/image?url=https%3A%2F%2Fpickbazarlaravel.s3.ap-southeast-1.amazonaws.com%2F1%2FDates.jpg&w=2048&q=75",
			name: "Date",
			slug: "date",
			originalPrice: 250000,
		},
	];

	return (
		<div className="container mx-auto bg-gray-50">
			<div className="flex gap-4">
				<Sidebar />
				<div className="my-5 grid grid-cols-4 gap-4 w-4/5">
					{productList.map((product, index) => (
						<ProductCard key={index} {...product} />
					))}
				</div>
			</div>
		</div>
	);
};

export default Products;
