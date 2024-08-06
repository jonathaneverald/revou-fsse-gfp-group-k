export interface City {
	city: string;
	id: number;
	slug: string;
}

export interface ApiResponse {
	message: string;
	data: City[];
}
