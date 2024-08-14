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
	context.res.setHeader(
		"Set-Cookie",
		"authToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcyMzYxMTQ0NCwianRpIjoiNDUwY2Y2NDUtMGYwYS00OTI1LTk5NDEtN2M5YzYwMjlmODZjIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MSwibmJmIjoxNzIzNjExNDQ0LCJjc3JmIjoiYTE0OTg3MGEtM2QzMS00MjRkLWFiOGUtODQ0Y2FjZGU0ZTNhIiwiZXhwIjoxNzIzNjk3ODQ0fQ.jvO3HDXrl1bh6a26zeMLx3m9LDHfuoYKybYu7Ml7_OE"
	);

	const authToken = context.req.cookies.authToken;

	try {
		const product = await useFetchProductDetail(slug, authToken as string);

		return { props: { product: product.data } };
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

	const { slug, category_name, description, name, price, seller_name, type, location_city } = product;

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
					productSlug={slug}
					locationCity={location_city}
				/>
			</div>
		</div>
	);
};

export default ProductDetail;
