import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { ProductImagesProps } from "@/types/product";

const ProductImage: React.FC<ProductImagesProps> = ({ images }) => (
	<div className="flex justify-center">
		<Carousel opts={{ align: "start" }} className="h-full max-w-sm">
			<CarouselContent>
				{Array.from({ length: 5 }).map((_, index) => (
					<CarouselItem key={index} className="w-full ">
						<div className="p-1">
							<Image
								className="aspect-square w-full object-cover rounded-md overflow-hidden"
								src={images[0]}
								width={400}
								height={400}
								alt="product image"
							/>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious className="left-3" />
			<CarouselNext className="right-3" />
		</Carousel>
	</div>
);

export default ProductImage;
