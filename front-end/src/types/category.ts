export interface Category {
	id: number;
	name: string;
	slug: string;
}

export interface ApiResponseCategoy {
	message: string;
	data: Category[];
}
