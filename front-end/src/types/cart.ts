import { VoucherMap } from "./voucher";

export interface CartItem {
	id: number;
	name: string;
	price: number;
	quantity: number;
	store: string;
}

export interface StoreSubtotal {
	store: string;
	subtotal: number;
	discount: number;
}

export interface CartItemsProps {
	cartItems: CartItem[];
	vouchers: VoucherMap;
	updateQuantity: (id: number, newQuantity: number) => void;
}

export interface CartSummaryProps {
	calculateTotal: number;
	vouchers: VoucherMap;
	calculateStoreSubtotals: StoreSubtotal[];
}
