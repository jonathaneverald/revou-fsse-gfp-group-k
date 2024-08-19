import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
// import useUpdateProduct from "@/hooks/useUpdateProduct"; // Assuming you have this hook
import ProductForm from "@/components/form/ProductForm";
import { getToken } from "@/utils/tokenUtils";
import { Product as ProductType } from "@/types/product";

const EditProduct: React.FC = () => {
	const router = useRouter();
	const { slug } = router.query;
	const [product, setProduct] = useState<any | null>(null);
	// const { updateProduct } = useUpdateProduct(); // Assuming you have this hook

	useEffect(() => {
		if (slug) {
			const fetchProduct = async () => {
				const token = getToken();
				const res = await fetch(`http://127.0.0.1:5000/product/${slug}`, {
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				});

				const { data }: { data: ProductType } = await res.json();

				const prod = {
					category_name: data.category_slug,
					description: data.description,
					name: data.name,
					price: data.price,
					quantity: data.quantity,
					type: data.type,
				};

				setProduct(prod);
			};
			fetchProduct();
		}
	}, [slug]);

	const handleEditProduct = async (data: any) => {
		// await updateProduct(slug, data);
		router.push("/products");
	};

	return <div>{product && <ProductForm initialValues={product} onSubmit={handleEditProduct} />}</div>;
};

export default EditProduct;
