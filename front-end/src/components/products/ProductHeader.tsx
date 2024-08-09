import Link from "next/link";
import { Badge } from "../ui/badge";
import { ProductHeaderProps } from "@/types/product";

const ProductHeader: React.FC<ProductHeaderProps> = ({ name, category, type, seller, locationCity }) => (
	<div>
		<div className="flex gap-2 my-2">
			<Link href={`/products?category=${category}`}>
				<Badge className="capitalize">{category}</Badge>
			</Link>
			<Link href={`/products?city=${locationCity}`}>
				<Badge className="capitalize">{locationCity}</Badge>
			</Link>

			<Badge className="capitalize">{type}</Badge>
		</div>
		<Link href="/seller/furniture-shop">
			<h2 className="font-semibold text-sm hover:underline capitalize">{seller}</h2>
		</Link>
		<h2 className="text-2xl text-gray-950 capitalize font-semibold">{name}</h2>
	</div>
);

export default ProductHeader;
