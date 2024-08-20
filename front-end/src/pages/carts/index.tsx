import dynamic from 'next/dynamic'
import React from 'react'
import { useCartItems } from '@/hooks/useCartItems'
import { useVouchers } from '@/hooks/useVouchers'
import { useCartCalculations } from '@/hooks/useCartCalculations'
import CartItems from '@/components/carts/CartItems'
import CartSummary from '@/components/carts/CartSummary'
import { useUpdateCartQuantity } from '@/hooks/useUpdateCartQuantity'
import { Skeleton } from '@/components/ui/skeleton' // Importing Skeleton from ShadCN

const DynamicBreadcrumb = dynamic(
    () =>
        import('@/components/menu/DynamicBreadcrumb').then(
            (mod) => mod.DynamicBreadcrumb
        ),
    { ssr: false }
)

const dummyVouchers = [
    {
        id: 1,
        code: 'SAVE10',
        description: 'Save 10% on your next purchase',
        discount: '10%',
        sellerId: 101,
    },
    {
        id: 2,
        code: 'FREESHIP',
        description: 'Free shipping on orders over $50',
        discount: 'Free Shipping',
        sellerId: 101,
    },
    {
        id: 3,
        code: 'WELCOME20',
        description: 'Get 20% off on your first order',
        discount: '20%',
        sellerId: 103,
    },
    {
        id: 4,
        code: 'BUY1GET1',
        description: 'Buy one, get one free on select items',
        discount: 'BOGO',
        sellerId: 104,
    },
]

interface Voucher {
    id: number
    code: string
    description: string
    discount: string
    sellerId: number
}

interface SellerVouchers {
    sellerId: number
    vouchers: Voucher[]
}

const VoucherList = ({ vouchers }: { vouchers: Voucher[] }) => {
    return (
        <div className="space-y-4 rounded-lg bg-white p-4">
            {vouchers.length > 0 ? (
                <ul className="space-y-2">
                    {vouchers.map((voucher) => (
                        <li
                            key={voucher.id}
                            className="flex items-center rounded-lg border px-2"
                        >
                            <input
                                type="radio"
                                name={'voucherID'}
                                id={`voucher-${voucher.id}`}
                                value={voucher.id}
                                className="mr-2"
                            />
                            <label
                                htmlFor={`voucher-${voucher.id}`}
                                className="flex-grow cursor-pointer py-2"
                            >
                                <p className="text-sm font-medium tracking-wide">{`${voucher.sellerId} ${voucher.code}`}</p>
                                <p className="text-sm text-green-600">
                                    Discount: {voucher.discount}
                                </p>
                            </label>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No vouchers available for this seller</p>
            )}
        </div>
    )
}

const Carts: React.FC = () => {
    const { cartItems, isLoading, isError } = useCartItems()
    const { vouchers } = useVouchers()
    const { calculateStoreSubtotals, calculateTotal } =
        useCartCalculations(cartItems)
    const { updateQuantity } = useUpdateCartQuantity()

    if (isError) return <div>Error loading cart items</div>

    const handleUpdateQuantity = async (id: number, newQuantity: number) => {
        await updateQuantity(id, newQuantity)
    }

    return (
        <div className="bg-gray-100 px-4 pb-5 md:container">
            <DynamicBreadcrumb />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-5 lg:grid-cols-5">
                <div className="md:col-span-3 lg:col-span-3">
                    {isLoading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-24 w-full" />
                        </div>
                    ) : (
                        <CartItems
                            cartItems={cartItems}
                            vouchers={vouchers}
                            updateQuantity={handleUpdateQuantity}
                        />
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
                                calculateStoreSubtotals={
                                    calculateStoreSubtotals
                                }
                                calculateTotal={calculateTotal}
                                vouchers={vouchers}
                            />
                        )
                    )}
                    <div>
                        <VoucherList vouchers={dummyVouchers} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Carts
