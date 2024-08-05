import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";

interface ProductImageProps {
	images: string[];
}

const ProductImage: React.FC<ProductImageProps> = ({ images }) => (
	<div className="flex justify-center">
		<Carousel opts={{ align: "start" }} className="w-full max-w-sm">
			<CarouselContent>
				{Array.from({ length: 5 }).map((_, index) => (
					<CarouselItem key={index} className="w-full">
						<div className="p-1">
							<Image
								className="aspect-square object-cover rounded-md overflow-hidden"
								src={images[0]}
								width={400}
								height={400}
								alt="product image"
							/>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious />
			<CarouselNext />
		</Carousel>
	</div>
);

export default ProductImage;
