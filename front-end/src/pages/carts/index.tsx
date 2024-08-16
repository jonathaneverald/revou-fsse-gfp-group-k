import dynamic from "next/dynamic";
import React from "react";
import { useCartItems } from "@/hooks/useCartItems";
import { useVouchers } from "@/hooks/useVouchers";
import { useCartCalculations } from "@/hooks/useCartCalculations";
import CartItems from "@/components/carts/CartItems";
import CartSummary from "@/components/carts/CartSummary";
import { useUpdateCartQuantity } from "@/hooks/useUpdateCartQuantity";
import { Skeleton } from "@/components/ui/skeleton"; // Importing Skeleton from ShadCN

const DynamicBreadcrumb = dynamic(
	() => import("@/components/menu/DynamicBreadcrumb").then((mod) => mod.DynamicBreadcrumb),
	{ ssr: false }
);

const Carts: React.FC = () => {
	const { cartItems, isLoading, isError } = useCartItems();
	const { vouchers } = useVouchers();
	const { calculateStoreSubtotals, calculateTotal } = useCartCalculations(cartItems);
	const { updateQuantity } = useUpdateCartQuantity();

	if (isError) return <div>Error loading cart items</div>;

	const handleUpdateQuantity = async (id: number, newQuantity: number) => {
		await updateQuantity(id, newQuantity);
	};

	return (
		<div className="px-4 md:container bg-gray-100 pb-5">
			<DynamicBreadcrumb />
			<div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-5 gap-4">
				<div className="md:col-span-3 lg:col-span-3">
					{isLoading ? (
						<div className="space-y-4">
							<Skeleton className="h-24 w-full" />
							<Skeleton className="h-24 w-full" />
							<Skeleton className="h-24 w-full" />
						</div>
					) : (
						<CartItems cartItems={cartItems} vouchers={vouchers} updateQuantity={handleUpdateQuantity} />
					)}
				</div>
				<div className="md:col-span-2 lg:col-span-2">
					{isLoading ? (
						<div className="space-y-4">
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
						</div>
					) : (
						cartItems && (
							<CartSummary
								calculateStoreSubtotals={calculateStoreSubtotals}
								calculateTotal={calculateTotal}
								vouchers={vouchers}
							/>
						)
					)}
				</div>
			</div>
		</div>
	);
};

export default Carts;
