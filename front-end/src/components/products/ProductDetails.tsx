import { formatIntToIDR } from "@/utils/currency";
import { Button } from "../ui/button";
import { ProductDetailsProps } from "@/types/product";
import { useAddToCart } from "@/hooks/useAddToCart";

const ProductDetails: React.FC<ProductDetailsProps> = ({ price, description }) => {
	return (
		<div className="flex flex-col space-y-5">
			<p className="text-gray-600 text-sm">{description}</p>
			<h3 className="text-2xl font-bold text-primary">{formatIntToIDR(price)}</h3>
		</div>
	);
};

export default ProductDetails;
