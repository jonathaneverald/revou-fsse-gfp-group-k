import { VoucherMap } from "./voucher";

export interface CartItem {
  id: number;
  product_name: string;
  price: number;
  quantity: number;
  seller_name: string;
  image_url: string[];
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
