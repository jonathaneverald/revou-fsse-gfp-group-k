import { formatIntToIDR } from "@/utils/currency";
import { Button } from "../ui/button";
import { ProductDetailsProps } from "@/types/product";

const ProductDetails: React.FC<ProductDetailsProps> = ({ price }) => (
	<div className="flex flex-col space-y-5">
		<p className="text-gray-600 text-sm">
			Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ea assumenda nesciunt excepturi aperiam culpa nisi
			molestias nostrum labore eveniet praesentium veritatis dolore possimus, inventore animi aliquid. Veniam
			molestias corrupti incidunt!
		</p>
		<h3 className="text-2xl font-bold text-primary">{formatIntToIDR(price)}</h3>
		<Button size="lg">Add to cart</Button>
	</div>
);

export default ProductDetails;
