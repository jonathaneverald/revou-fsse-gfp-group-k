import React from "react";
import ProductDetails from "./ProductDetails";
import ProductHeader from "./ProductHeader";
import { ProductInfoProps } from "@/types/product";
import { Button } from "../ui/button";
import { useAddToCart } from "@/hooks/useAddToCart";

const ProductInfo: React.FC<ProductInfoProps> = ({
	name,
	price,
	category,
	categorySlug,
	seller,
	sellerSlug,
	description,
	type,
	productSlug,
	locationCity,
}) => {
	const { addToCart, isLoading } = useAddToCart();

	const handleAddToCart = () => {
		addToCart(productSlug);
	};

	return (
		<div className="flex w-full md:w-full lg:w-3/4 flex-col space-y-5">
			<ProductHeader
				name={name}
				category={category}
				categorySlug={categorySlug}
				seller={seller}
				sellerSlug={sellerSlug}
				type={type}
				locationCity={locationCity}
			/>
			<ProductDetails price={price} description={description} />
			<Button size="lg" onClick={handleAddToCart}>
				{isLoading ? "Adding..." : "Add to cart"}
			</Button>
		</div>
	);
};
export default ProductInfo;
