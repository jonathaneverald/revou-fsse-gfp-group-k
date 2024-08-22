export interface CartItem {
    id: number
    product_name: string
    price: number
    quantity: number
    seller_name: string
    image_url: string[]
}

interface Voucher {
    voucher_name: string
    discount: string
    seller_id: number
    seller_name: string
    voucher_id: number
}

export interface StoreSubtotal {
    store: string
    subtotal: number
    discount: number
}

export interface CartItemsProps {
    cartItems: CartItem[]
    vouchers: Voucher[]
    updateQuantity: (id: number, newQuantity: number) => void
}

export interface CartSummaryProps {
    calculateTotal: number
    voucher: Voucher | null
    calculateStoreSubtotals: StoreSubtotal[]
}
