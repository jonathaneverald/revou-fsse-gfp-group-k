import { getToken } from "@/utils/tokenUtils";
import axios from "axios";
import useSWR from "swr";

interface Product {
	price: number;
	product_name: string;
	quantity: number;
}

interface Transaction {
	discount: number | null;
	id: number;
	products: Product[];
	status: string;
	total_price: number;
	voucher_applied: null;
}

interface ApiResponse {
	data: Transaction[];
	message: string;
}

const fetcher = async (url: string) => {
	const token = getToken();
	const response = await axios.get(url, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data;
};

export function useTransactionSeller() {
	const { data, error, isLoading } = useSWR<ApiResponse>("http://127.0.0.1:5000/transaction-seller", fetcher);

	return {
		transactions: data?.data || [],
		message: data?.message,
		isLoading: isLoading,
		isError: error,
	};
}
