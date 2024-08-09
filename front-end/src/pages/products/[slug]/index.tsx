import React from "react";
import dynamic from "next/dynamic";
import { GetServerSideProps } from "next";
import ProductImage from "@/components/products/ProductImage";
import ProductInfo from "@/components/products/ProductInfo";
import useFetchProductDetail from "@/hooks/useFetchProductDetail";
import { ProductDetailProps } from "@/types/product";

const DynamicBreadcrumb = dynamic(
	() => import("@/components/menu/DynamicBreadcrumb").then((mod) => mod.DynamicBreadcrumb),
	{ ssr: false }
);

export const getServerSideProps: GetServerSideProps<ProductDetailProps> = async (context) => {
	const slug = context.query.slug as string;

	try {
		const product = await useFetchProductDetail(slug);
		return { props: { product } };
	} catch (error) {
		return { props: { error: (error as Error).message } };
	}
};

const ProductDetail: React.FC<ProductDetailProps> = ({ product, error }) => {
	if (error) {
		return <p className="text-red-500">Failed to load product</p>;
	}

	if (!product) {
		return <p>Product not found</p>;
	}

	const { product_slug, category_name, description, name, price, seller_name, type } = product;

	return (
		<div className="mx-4 md:container">
			<DynamicBreadcrumb />
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 bg-white rounded-md p-10">
				<ProductImage images={["https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2"]} />
				<ProductInfo
					name={name}
					price={price}
					category={category_name}
					categorySlug={category_name}
					seller={seller_name}
					sellerSlug={seller_name}
					description={description}
					type={type}
					productSlug={product_slug}
				/>
			</div>
		</div>
	);
};

export default ProductDetail;
