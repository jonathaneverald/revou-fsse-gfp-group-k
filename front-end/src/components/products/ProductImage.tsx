import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { ProductImagesProps } from "@/types/product";

const ProductImage: React.FC<ProductImagesProps> = ({ images }) => {
  // Provide a default placeholder image if no images are available
  const defaultImage = "https://via.placeholder.com/400x400?text=No+Image";
  const displayImages = images.length > 0 ? images : [defaultImage];

  return (
    <div className="flex justify-center">
      <Carousel opts={{ align: "start" }} className="h-full max-w-sm">
        <CarouselContent>
          {displayImages.map((image, index) => (
            <CarouselItem key={index} className="w-full ">
              <div className="p-1">
                <Image
                  className="aspect-square w-full object-cover rounded-md overflow-hidden"
                  src={image}
                  width={400}
                  height={400}
                  alt={`product image ${index + 1}`}
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
};

export default ProductImage;
