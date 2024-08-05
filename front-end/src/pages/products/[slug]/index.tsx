// import { DynamicBreadcrumb } from "@/components/menu/DynamicBreadcrumb";
import ProductImage from "@/components/products/ProductImage";
import ProductInfo from "@/components/products/ProductInfo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { formatIntToIDR } from "@/utils/currency";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const DynamicBreadcrumb = dynamic(
	() => import("@/components/menu/DynamicBreadcrumb").then((mod) => mod.DynamicBreadcrumb),
	{ ssr: false }
);

const ProductDetail = () => {
	const router = useRouter();
	const { slug } = router.query;

	const images = ["https://images.unsplash.com/photo-1518843875459-f738682238a6"];
	const name = slug as string;
	const price = 400000;
	const category = "Furniture";
	const categorySlug = "furniture";
	const seller = "Furniture Shop";
	const sellerSlug = "furniture-shop";

	return (
		<div className="mx-4 md:container">
			<DynamicBreadcrumb />
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
				<ProductImage images={images} />
				<ProductInfo
					name={name}
					price={price}
					category={category}
					categorySlug={categorySlug}
					seller={seller}
					sellerSlug={sellerSlug}
				/>
			</div>
		</div>
	);
};

export default ProductDetail;
