import { useMemo } from 'react'
import { useVouchers } from './useVouchers'
import { StoreSubtotal, CartItem } from '@/types/cart'

export const useCartCalculations = (cartItems: CartItem[] = []) => {
    const { vouchers } = useVouchers()

    const calculateStoreSubtotals = useMemo((): StoreSubtotal[] => {
        const storeSubtotals: { [key: string]: StoreSubtotal } = {}

        // Guard clause for empty cart
        if (!cartItems) {
            return []
        }

        cartItems.forEach((item) => {
            if (!storeSubtotals[item.seller_name]) {
                storeSubtotals[item.seller_name] = {
                    store: item.seller_name,
                    subtotal: 0,
                    discount: 0,
                }
            }
            const subtotal = item.price * item.quantity
            storeSubtotals[item.seller_name].subtotal += subtotal
        })

        return Object.values(storeSubtotals)
    }, [cartItems, vouchers])

    const calculateTotal = useMemo((): number => {
        if (calculateStoreSubtotals.length === 0) {
            return 0
        }
        return calculateStoreSubtotals.reduce(
            (total, store) => total + store.subtotal - store.discount,
            0
        )
    }, [calculateStoreSubtotals])

    return { calculateStoreSubtotals, calculateTotal }
}
