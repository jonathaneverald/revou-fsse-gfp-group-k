import React from "react";
import ProductDetails from "./ProductDetails";
import ProductHeader from "./ProductHeader";
import { ProductInfoProps } from "@/types/product";

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
}) => (
	<div className="flex w-full md:w-3/4 flex-col space-y-5">
		<ProductHeader
			name={name}
			category={category}
			categorySlug={categorySlug}
			seller={seller}
			sellerSlug={sellerSlug}
			type={type}
		/>
		<ProductDetails price={price} description={description} productSlug={productSlug} />
	</div>
);

export default ProductInfo;
