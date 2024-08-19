import React from "react";
import { useRouter } from "next/router";
import useCreateProduct from "@/hooks/useCreateProduct";
import ProductForm from "@/components/form/ProductForm";

const AddProduct: React.FC = () => {
	const router = useRouter();
	const { createProduct, isLoading, error, success } = useCreateProduct();

	const handleAddProduct = async (data: any) => {
		await createProduct(data);
		router.push("/products");
	};

	return (
		<div>
			<ProductForm onSubmit={handleAddProduct} />
		</div>
	);
};

export default AddProduct;
