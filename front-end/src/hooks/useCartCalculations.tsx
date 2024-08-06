import { useMemo } from "react";
import { useVouchers } from "./useVouchers";
import { StoreSubtotal, CartItem } from "@/types/cart";

export const useCartCalculations = (cartItems: CartItem[]) => {
	const { vouchers } = useVouchers();

	const calculateStoreSubtotals = useMemo((): StoreSubtotal[] => {
		const storeSubtotals: { [key: string]: StoreSubtotal } = {};

		cartItems.forEach((item) => {
			if (!storeSubtotals[item.store]) {
				storeSubtotals[item.store] = { store: item.store, subtotal: 0, discount: 0 };
			}
			const subtotal = item.price * item.quantity;
			storeSubtotals[item.store].subtotal += subtotal;

			if (vouchers[item.store]) {
				const voucher = vouchers[item.store];
				if (voucher.type === "percentage") {
					storeSubtotals[item.store].discount += subtotal * (voucher.value / 100);
				} else {
					storeSubtotals[item.store].discount += Math.min(voucher.value, subtotal);
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
