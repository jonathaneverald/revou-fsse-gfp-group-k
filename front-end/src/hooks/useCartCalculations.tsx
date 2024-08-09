import { useMemo } from "react";
import { useVouchers } from "./useVouchers";
import { StoreSubtotal, CartItem } from "@/types/cart";

export const useCartCalculations = (cartItems: CartItem[] = []) => {
	const { vouchers } = useVouchers();

	const calculateStoreSubtotals = useMemo((): StoreSubtotal[] => {
		const storeSubtotals: { [key: string]: StoreSubtotal } = {};

		cartItems.forEach((item) => {
			if (!storeSubtotals[item.seller_name]) {
				storeSubtotals[item.seller_name] = { store: item.seller_name, subtotal: 0, discount: 0 };
			}
			const subtotal = item.price * item.quantity;
			storeSubtotals[item.seller_name].subtotal += subtotal;

			if (vouchers[item.seller_name]) {
				const voucher = vouchers[item.seller_name];
				if (voucher.type === "percentage") {
					storeSubtotals[item.seller_name].discount += subtotal * (voucher.value / 100);
				} else {
					storeSubtotals[item.seller_name].discount += Math.min(voucher.value, subtotal);
				}
			}
		});

		return Object.values(storeSubtotals);
	}, [cartItems, vouchers]);

	const calculateTotal = useMemo((): number => {
		return calculateStoreSubtotals.reduce((total, store) => total + store.subtotal - store.discount, 0);
	}, [calculateStoreSubtotals]);

	return { calculateStoreSubtotals, calculateTotal };
};
