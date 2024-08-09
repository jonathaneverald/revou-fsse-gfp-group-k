// export interface Product {
// 	category_id: number;
// 	category_name: string;
// 	description: string;
// 	id: number;
// 	name: string;
// 	price: string;
// 	quantity: number;
// 	seller_id: number;
// 	seller_name: string;
// 	slug: string;
// 	type: string;
// 	user_id: number;
// }

export interface ProductCardProps {
	image: string;
	name: string;
	product_slug: string;
	originalPrice: number;
	description: string;
	type: string;
	seller_name: string;
	seller_slug: string;
}

export interface ProductDetailsProps {
	price: number;
	description: string;
}

export interface ProductHeaderProps {
	name: string;
	category: string;
	categorySlug: string;
	seller: string;
	sellerSlug: string;
	type: string;
	locationCity: string;
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
	description: string;
	type: string;
	productSlug: string;
	locationCity: string;
}

export interface Product {
	category_name: string;
	description: string;
	id: string;
	name: string;
	price: number;
	quantity: number;
	seller_name: string;
	slug: string;
	type: string;
	seller_slug: string;
	location_city: string;
}

export interface ProductDetailProps {
	product?: Product;
	error?: string;
}
