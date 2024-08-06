import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { formatIntToIDR } from "@/utils/currency";
import { Button } from "../ui/button";
import { CartSummaryProps } from "@/types/cart";

const CartSummary: React.FC<CartSummaryProps> = ({ calculateStoreSubtotals, calculateTotal, vouchers }) => {
	return (
		<Card>
			<CardHeader className="p-4">
				<CardTitle>Shopping summary</CardTitle>
			</CardHeader>
			<CardContent className="p-4">
				<div className="space-y-4">
					{calculateStoreSubtotals.map((storeSubtotal) => (
						<div key={storeSubtotal.store} className="space-y-1">
							<div className="font-semibold">{storeSubtotal.store}</div>
							<div className="flex justify-between text-sm">
								<span>Subtotal:</span>
								<span>{formatIntToIDR(storeSubtotal.subtotal)}</span>
							</div>
							{storeSubtotal.discount > 0 && (
								<div className="flex justify-between text-sm text-green-600">
									<span>Discount ({vouchers[storeSubtotal.store].code}):</span>
									<span>-{formatIntToIDR(storeSubtotal.discount)}</span>
								</div>
							)}
							<div className="flex justify-between text-sm font-semibold">
								<span>Store Total:</span>
								<span>{formatIntToIDR(storeSubtotal.subtotal - storeSubtotal.discount)}</span>
							</div>
						</div>
					))}
					<hr className="my-2" />
					<div className="flex justify-between font-bold">
						<span>Total:</span>
						<span>{formatIntToIDR(calculateTotal)}</span>
					</div>
				</div>
			</CardContent>
			<CardFooter>
				<Button className="w-full">Proceed to Checkout</Button>
			</CardFooter>
		</Card>
	);
};

export default CartSummary;
