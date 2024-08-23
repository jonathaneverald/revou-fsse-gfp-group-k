import React from 'react'
import { Card } from '../ui/card'
import Image from 'next/image'
import { Button } from '../ui/button'
import { formatIntToIDR } from '@/utils/currency'
import { Input } from '../ui/input'
import { CartItemsProps } from '@/types/cart'

const CartItems: React.FC<CartItemsProps> = ({
    cartItems,
    vouchers,
    updateQuantity,
}) => {
    return (
        <>
            {!cartItems ? (
                <Card className="mb-2 flex h-28 items-center justify-center">
                    <p className="text-gray-500">Your cart is empty.</p>
                </Card>
            ) : (
                cartItems.map((item: any) => (
                    <Card key={item.id} className="mb-2">
                        <div className="flex gap-4 p-4">
                            <Image
                                className="aspect-square size-24 rounded-sm object-cover"
                                src={
                                    item.image_url ||
                                    'https://via.placeholder.com/300x200?text=No+Image'
                                }
                                width={80}
                                height={80}
                                alt="product image"
                            />
                            <div className="flex w-full flex-col justify-between">
                                <div className="mt-2 grid grid-cols-3">
                                    <div className="col-span-3 text-xs font-semibold capitalize text-gray-500">
                                        {item.seller_name}
                                    </div>
                                    <div className="col-span-3 line-clamp-1 text-xs font-semibold md:col-span-2 md:line-clamp-none md:text-sm">
                                        {item.product_name}
                                    </div>
                                    <div className="font-semibold md:text-end">
                                        <span className="text-sm">
                                            {formatIntToIDR(
                                                item.price * item.quantity
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <div className="flex w-fit rounded-md border p-[1px]">
                                        <Button
                                            size={'sm'}
                                            className="size-7 bg-transparent text-primary hover:bg-transparent"
                                            onClick={() =>
                                                updateQuantity(
                                                    item.id,
                                                    item.quantity - 1
                                                )
                                            }
                                        >
                                            -
                                        </Button>
                                        <Input
                                            className="mx-1 size-7 border-none p-0 text-center text-sm focus:outline-none"
                                            value={item.quantity}
                                            onChange={(e) =>
                                                updateQuantity(
                                                    item.id,
                                                    parseInt(e.target.value) ||
                                                        1
                                                )
                                            }
                                        />
                                        <Button
                                            size={'sm'}
                                            className="size-7 bg-transparent text-primary hover:bg-transparent"
                                            onClick={() =>
                                                updateQuantity(
                                                    item.id,
                                                    item.quantity + 1
                                                )
                                            }
                                        >
                                            +
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))
            )}
        </>
    )
}

export default CartItems
