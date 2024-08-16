import { getToken } from "@/utils/tokenUtils";
import axios from "axios";

interface Transaction {
	id: number;
	amount: number;
	description: string;
}

const API_ENDPOINT = "http://127.0.0.1:5000/transaction";

export function useTransactionPost() {
	const postTransaction = async (): Promise<Transaction> => {
		try {
			const token = getToken();
			const response = await axios.post(
				API_ENDPOINT,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			return response.data;
		} catch (error) {
			console.error("Error posting transaction:", error);
			throw error;
		}
	};

	return { postTransaction };
}
