import { useState } from "react";
import { getToken } from "@/utils/tokenUtils";
import { mutate } from "swr";

export const useUpdateCartQuantity = () => {
	const [isUpdating, setIsUpdating] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const updateQuantity = async (id: number, newQuantity: number) => {
		setIsUpdating(true);
		setError(null);

		try {
			const token = getToken();
			const response = await fetch(`http://127.0.0.1:5000/cart/${id}`, {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ quantity: newQuantity }),
			});

			if (!response.ok) {
				throw new Error("Failed to update cart quantity");
			}

			// Trigger a revalidation of the cart data
			await mutate("http://127.0.0.1:5000/cart");
			setIsUpdating(false);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to update cart quantity");
			setIsUpdating(false);
		}
	};

	return { updateQuantity, isUpdating, error };
};
