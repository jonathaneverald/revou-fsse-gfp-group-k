import React from "react";
import { Card } from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import { formatIntToIDR } from "@/utils/currency";
import { Input } from "../ui/input";
import { CartItemsProps } from "@/types/cart";

const CartItems: React.FC<CartItemsProps> = ({ cartItems, vouchers, updateQuantity }) => {
	return (
		<>
			{cartItems.map((item: any) => (
				<Card key={item.id} className="mb-2">
					<div className="p-4 flex gap-4">
						<Image
							className="rounded-sm size-24 object-cover aspect-square"
							src={"https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2"}
							width={80}
							height={80}
							alt="product image"
						/>
						<div className="w-full flex justify-between flex-col">
							<div className="grid grid-cols-3 mt-2">
								<div className="font-semibold text-gray-500 text-xs col-span-3 capitalize">
									{item.store}
									{vouchers[item.store] && (
										<span className="ml-2 text-green-500">({vouchers[item.store].code})</span>
									)}
								</div>
								<div className="font-semibold line-clamp-1 md:line-clamp-none text-xs md:text-sm col-span-3 md:col-span-2">
									{item.name}
								</div>
								<div className="font-semibold md:text-end">
									<span className="text-sm">{formatIntToIDR(item.price * item.quantity)}</span>
								</div>
							</div>
							<div className="flex justify-end">
								<div className="flex border p-[1px] w-fit rounded-md">
									<Button
										size={"sm"}
										className="size-7 bg-transparent text-primary hover:bg-transparent"
										onClick={() => updateQuantity(item.id, item.quantity - 1)}
									>
										-
									</Button>
									<Input
										className="size-7 mx-1 focus:outline-none border-none text-center text-sm p-0"
										value={item.quantity}
										onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
									/>
									<Button
										size={"sm"}
										className="size-7 bg-transparent text-primary hover:bg-transparent"
										onClick={() => updateQuantity(item.id, item.quantity + 1)}
									>
										+
									</Button>
								</div>
							</div>
						</div>
					</div>
				</Card>
			))}
		</>
	);
};

export default CartItems;
