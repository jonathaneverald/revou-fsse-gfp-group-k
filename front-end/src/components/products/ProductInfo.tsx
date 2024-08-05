import React from "react";
import ProductDetails from "./ProductDetails";
import ProductHeader from "./ProductHeader";

interface ProductInfoProps {
	name: string;
	price: number;
	category: string;
	categorySlug: string;
	seller: string;
	sellerSlug: string;
}

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
