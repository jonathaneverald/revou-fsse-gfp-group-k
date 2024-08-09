import { useState } from "react";
import { getToken } from "@/utils/tokenUtils";
import { toast } from "sonner";

export const useAddToCart = () => {
	const [isLoading, setIsLoading] = useState(false);

	const addToCart = async (productSlug: string, quantity: number = 1) => {
		setIsLoading(true);
		try {
			const token = getToken();

			const response = await fetch("http://127.0.0.1:5000/cart", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					product_slug: productSlug,
					quantity,
				}),
			});

			const result = await response.json();

			if (response.ok) {
				toast("Product added to cart successfully");
			} else {
				toast(result.message);
			}
		} catch (error) {
			toast("Error adding product to cart");
		} finally {
			setIsLoading(false);
		}
	};

	return { addToCart, isLoading };
};
