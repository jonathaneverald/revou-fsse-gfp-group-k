import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { formatIntToIDR } from "@/utils/currency";
import Link from "next/link";
import { ProductCardProps } from "@/types/product";
import { HomeIcon, Store } from "lucide-react";

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  name,
  seller_slug,
  originalPrice,
  description,
  seller_name,
  type,
  product_slug,
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        {image ? (
          <Image
            priority
            width={100}
            height={100}
            src={image}
            alt={name}
            className="aspect-[4/3] w-full object-cover"
          />
        ) : (
          <div className="aspect-[4/3] w-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No Image Available</span>
          </div>
        )}
        <Badge className="absolute top-2 text-[10px] right-2 bg-yellow-400 hover:bg-yellow-400 text-black capitalize">
          {type}
        </Badge>
      </div>
      <div className="p-3 space-y-1">
        <Link href={`/products/${product_slug}`}>
          <h3 className="text-sm md:text-sm tracking-wide font-semibold">
            {name}
          </h3>
        </Link>
        <div className="flex items-center">
          <Store className="size-3" />
          <Link
            href={`/stores/${seller_slug}`}
            className="ml-[2px] tracking-wider capitalize text-xs line-clamp-2 text-gray-700"
          >
            {seller_name}
          </Link>
        </div>
        <p className="text-xs line-clamp-2 text-gray-500">{description}</p>
        <div className="flex flex-col">
          <span className="text-primary font-bold text-sm">
            {formatIntToIDR(originalPrice)}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
