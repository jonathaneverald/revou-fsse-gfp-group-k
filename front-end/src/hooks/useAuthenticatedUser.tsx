import useSWR from "swr";
import { useRouter } from "next/router";
import { User } from "@/types/user";
import { getToken, setToken } from "@/utils/tokenUtils";

const useUserProfile = () => {
	const router = useRouter();

	const fetcher = async (url: string) => {
		setToken(
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcyMzE5NjExOCwianRpIjoiZGU5YWMxY2ItYmFkYS00YTY4LTg3ZDEtZTVhNWRlN2FmNTcyIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MSwibmJmIjoxNzIzMTk2MTE4LCJjc3JmIjoiMzdlNTg1ZTItZThjMS00ZmZhLThmZmItNTJlY2YwMGNlZDhjIiwiZXhwIjoxNzIzNTU2MTE4fQ.Q-wcgrIoMyhHHdHwbe0nEBEcrFa2KEYGx8A93rmFxyI"
		);
		const token = getToken();

		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			router.push("/");
		}

		const data = await response.json();

		if (data.msg == "Token has expired") {
			router.push("/");
		}

		return data.data;
	};

	// const fetcher = async (url: string) => {
	// 	await new Promise((resolve) => setTimeout(resolve, 5000));
	// 	const response = await fetch(url);
	// 	return response.json();
	// };

	const { data: user, error } = useSWR<User>("http://127.0.0.1:5000/profile", fetcher);

	return { user, error, isLoading: !error && !user };
};

export default useUserProfile;
