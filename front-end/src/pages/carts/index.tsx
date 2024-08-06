import dynamic from "next/dynamic";
import React from "react";
import { useCartItems } from "@/hooks/useCartItems";
import { useVouchers } from "@/hooks/useVouchers";
import { useCartCalculations } from "@/hooks/useCartCalculations";
import CartItems from "@/components/carts/CartItems";
import CartSummary from "@/components/carts/CartSummary";

const DynamicBreadcrumb = dynamic(
	() => import("@/components/menu/DynamicBreadcrumb").then((mod) => mod.DynamicBreadcrumb),
	{ ssr: false }
);

const Carts: React.FC = () => {
	const { cartItems, updateQuantity } = useCartItems();
	const { vouchers } = useVouchers();
	const { calculateStoreSubtotals, calculateTotal } = useCartCalculations(cartItems);

	return (
		<div className="px-4 md:container bg-gray-100 pb-5">
			<DynamicBreadcrumb />
			<div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
				<div className="md:col-span-3 lg:col-span-3">
					<CartItems cartItems={cartItems} vouchers={vouchers} updateQuantity={updateQuantity} />
				</div>
				<div className="md:col-span-1 lg:col-span-2">
					<CartSummary
						calculateStoreSubtotals={calculateStoreSubtotals}
						calculateTotal={calculateTotal}
						vouchers={vouchers}
					/>
				</div>
			</div>
		</div>
	);
};

export default Carts;
