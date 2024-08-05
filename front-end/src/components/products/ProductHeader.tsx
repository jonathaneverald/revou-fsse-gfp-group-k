import Link from "next/link";
import { Badge } from "../ui/badge";

interface ProductHeaderProps {
	name: string;
	category: string;
	categorySlug: string;
	seller: string;
	sellerSlug: string;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ name }) => (
	<div>
		<div className="flex gap-2 my-2">
			<Badge>Buah</Badge>
			<Badge>Premium</Badge>
		</div>
		<Link href="/seller/furniture-shop">
			<h2 className="font-semibold text-sm hover:underline">Furniture Shop</h2>
		</Link>
		<h2 className="text-2xl text-gray-950 capitalize font-semibold">{name}</h2>
	</div>
);

export default ProductHeader;
