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
		"authToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcyMzcxMDU2NiwianRpIjoiMDUzM2ZkODUtMzZmNi00MjVkLWEwNzAtZmU1ZmM1MjEwNmI2IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MSwibmJmIjoxNzIzNzEwNTY2LCJjc3JmIjoiYjhlZDg2MTMtZmNiYS00MDM0LTg5OTUtZGVhYzk5ZjliYzIwIiwiZXhwIjoxNzIzNzk2OTY2fQ.ChDMwHZnE5mZaHFwTY86K4642h0Qw5qYL8aFnx-8dyw"
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
