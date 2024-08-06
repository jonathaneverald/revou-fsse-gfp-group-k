import React from "react";
import ProductDetails from "./ProductDetails";
import ProductHeader from "./ProductHeader";
import { ProductInfoProps } from "@/types/product";

const ProductInfo: React.FC<ProductInfoProps> = ({ name, price, category, categorySlug, seller, sellerSlug }) => (
	<div className="flex w-full md:w-3/4 flex-col space-y-5">
		<ProductHeader
			name={name}
			category={category}
			categorySlug={categorySlug}
			seller={seller}
			sellerSlug={sellerSlug}
		/>
		<ProductDetails price={price} />
	</div>
);

export default ProductInfo;
