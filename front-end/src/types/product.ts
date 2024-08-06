export interface ProductCardProps {
	image: string;
	name: string;
	slug: string;
	originalPrice: number;
}

export interface ProductDetailsProps {
	price: number;
}

export interface ProductHeaderProps {
	name: string;
	category: string;
	categorySlug: string;
	seller: string;
	sellerSlug: string;
}

export interface ProductImagesProps {
	images: string[];
}

export interface ProductInfoProps {
	name: string;
	price: number;
	category: string;
	categorySlug: string;
	seller: string;
	sellerSlug: string;
}
