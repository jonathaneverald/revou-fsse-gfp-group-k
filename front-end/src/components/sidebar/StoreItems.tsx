import React from 'react'
import { Avatar, AvatarFallback } from '../ui/avatar'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Package, ShoppingCart, TicketPercent } from 'lucide-react'
import { Badge } from '../ui/badge'
import { SellerProfile } from '@/types/seller'

interface StoreItemsProps {
    sellerProfile: SellerProfile | null
    handleOpenStoreForm: () => void
}

const StoreSideItems: React.FC<StoreItemsProps> = ({
    sellerProfile,
    handleOpenStoreForm,
}) => {
    const router = useRouter()

    const isActive = (path: string) => router.pathname === path

    return (
        <>
            <div className="flex items-center border-b py-3">
                <Avatar className="mr-2 cursor-pointer border">
                    <AvatarFallback>
                        {sellerProfile?.name
                            .split(' ')
                            .map((word) => word[0])
                            .join('') || 'U'}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col justify-center">
                    <span
                        className="cursor-pointer text-sm font-semibold hover:underline"
                        onClick={handleOpenStoreForm}
                    >
                        {sellerProfile?.name}
                    </span>
                    <span className="text-xs text-gray-600">
                        {sellerProfile?.location_name}
                    </span>
                </div>
            </div>

            <Link
                href="/stores/orders"
                className={`my-1 flex cursor-pointer items-center justify-between rounded-md p-2 py-3 text-sm font-medium capitalize ${
                    isActive('/stores/orders')
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
            >
                <div className="flex items-center">
                    <ShoppingCart className="mr-2 size-[18px]" />
                    Orders
                </div>
                <Badge
                    variant="destructive"
                    className="flex items-center justify-center text-[10px]"
                >
                    9
                </Badge>
            </Link>
            <Link
                href="/stores/products"
                className={`my-1 flex cursor-pointer items-center justify-between rounded-md p-2 py-3 text-sm font-medium capitalize ${
                    isActive('/stores/products')
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
            >
                <div className="flex items-center">
                    <Package className="mr-2 size-[18px]" />
                    Products
                </div>
            </Link>
            <Link
                href="/stores/vouchers"
                className={`my-1 flex cursor-pointer items-center justify-between rounded-md p-2 py-3 text-sm font-medium capitalize ${
                    isActive('/stores/vouchers')
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
            >
                <div className="flex items-center">
                    <TicketPercent className="mr-2 size-[18px]" />
                    Vouchers
                </div>
            </Link>
        </>
    )
}

export default StoreSideItems
