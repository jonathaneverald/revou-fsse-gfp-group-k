import { useState } from "react";
import axios from "axios";
import { getToken } from "@/utils/tokenUtils";

type ProductData = {
	name: string;
	description: string;
	category_name: string;
	type: string;
	// status: string;
	price: number;
	quantity: number;
};

const useCreateProduct = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean>(false);

	const createProduct = async (productData: ProductData) => {
		setIsLoading(true);
		setError(null);
		setSuccess(false);
		const token = getToken();

		try {
			const response = await axios.post("http://127.0.0.1:5000/product", productData, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setSuccess(true);
			return response.data;
		} catch (err) {
			setError("Failed to create product. Please try again.");
			return null;
		} finally {
			setIsLoading(false);
		}
	};

	return { createProduct, isLoading, error, success };
};

export default useCreateProduct;
