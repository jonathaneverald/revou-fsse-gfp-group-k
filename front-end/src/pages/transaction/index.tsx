import React from "react";
import { GetServerSideProps } from "next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatIntToIDR } from "@/utils/currency";

interface Product {
	price: number;
	product_name: string;
	quantity: number;
}

interface Transaction {
	id: number;
	discount: number;
	products: Product[];
	status: string;
	total_price: number;
	voucher_applied: string;
}

interface TransactionsResponse {
	data: Transaction[];
	message: string;
}

interface Props {
	transactions: Transaction[];
	error?: string;
}

const TransactionsPage: React.FC<Props> = ({ transactions, error }) => {
	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div className="p-4 md:px-6">
			<h1 className="text-2xl font-bold mb-4">Transactions</h1>
			{transactions.length === 0 ? (
				<p>No transactions found.</p>
			) : (
				<div className="overflow-x-auto">
					<Table className="min-w-full divide-y divide-gray-200">
						<TableHeader className="bg-gray-50">
							<TableRow>
								<TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									ID
								</TableHead>
								<TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Status
								</TableHead>
								<TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Total Price
								</TableHead>
								<TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Discount
								</TableHead>
								<TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Voucher Applied
								</TableHead>
								<TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Products
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody className="bg-white divide-y divide-gray-200">
							{transactions.map((transaction) => (
								<TableRow key={transaction.id}>
									<TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
										{transaction.id}
									</TableCell>
									<TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{transaction.status}
									</TableCell>
									<TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{formatIntToIDR(transaction.total_price)}
									</TableCell>
									<TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{transaction.discount}
									</TableCell>
									<TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{transaction.voucher_applied}
									</TableCell>
									<TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										<ul>
											{transaction.products.map((product, index) => (
												<li key={index}>
													{product.product_name} - {product.quantity} @{" "}
													{formatIntToIDR(product.price)}
												</li>
											))}
										</ul>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}
		</div>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	try {
		const authToken = context.req.cookies.jwtToken;

		const res = await fetch("http://127.0.0.1:5000/transaction", {
			headers: {
				Authorization: `Bearer ${authToken}`,
			},
		});

		if (!res.ok) {
			throw new Error("Failed to fetch data");
		}
		const data: TransactionsResponse = await res.json();

		return {
			props: {
				transactions: data.data,
			},
		};
	} catch (error) {
		return {
			props: {
				transactions: [],
				error: (error as Error).message,
			},
		};
	}
};

export default TransactionsPage;
