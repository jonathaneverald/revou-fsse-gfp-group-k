import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { formatIntToIDR } from "@/utils/currency";
import Link from "next/link";

interface ProductCardProps {
	image: string;
	name: string;
	slug: string;
	originalPrice: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ image, name, slug, originalPrice }) => {
	return (
		<Card className="overflow-hidden">
			<div className="relative">
				<Image width={100} height={100} src={image} alt={name} className="aspect-square w-full object-cover" />
				<Badge className="absolute top-2 right-2 bg-yellow-400 hover:bg-yellow-400 text-black">Premium</Badge>
			</div>
			<div className="p-4">
				<Link href={`/products/${slug}`}>
					<h3 className="text-lg font-semibold">{name}</h3>
				</Link>
				<p className="text-sm line-clamp-1 text-gray-500">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut facere praesentium voluptates dolor,
					impedit at quae inventore magni porro similique ratione fugit, architecto dolores, unde perspiciatis
					deleniti illo incidunt minima!
				</p>
				<div className="flex flex-col">
					<span className="text-primary font-bold text-sm">{formatIntToIDR(originalPrice)}</span>
				</div>
			</div>
		</Card>
	);
};

export default ProductCard;
