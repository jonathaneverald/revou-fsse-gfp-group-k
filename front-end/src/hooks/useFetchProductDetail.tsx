const useFetchProductDetail = async (slug: string) => {
	try {
		const res = await fetch(`http://127.0.0.1:5000/product/${slug}`);
		if (!res.ok) {
			throw new Error("Failed to fetch product data");
		}
		const data = await res.json();
		return data.data;
	} catch (error) {
		throw new Error((error as Error).message);
	}
};

export default useFetchProductDetail;
