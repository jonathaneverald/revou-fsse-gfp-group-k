import { CartItem } from "@/types/cart";
import { useState } from "react";

export const useCartItems = () => {
	const [cartItems, setCartItems] = useState<CartItem[]>([
		{ id: 1, name: "Lavazza Super Crema Whole Bean Coffee", price: 19000, quantity: 2, store: "Coffee House" },
		{ id: 2, name: "Illy Classico Espresso Ground Coffee", price: 29000, quantity: 1, store: "Bean Paradise" },
		{ id: 3, name: "Death Wish Coffee Co. Ground Coffee", price: 9000, quantity: 3, store: "Caffeine Central" },
		{ id: 4, name: "Stumptown Hair Bender Whole Bean Coffee", price: 15000, quantity: 5, store: "Coffee Emporium" },
		{
			id: 5,
			name: "Kicking Horse Coffee, Kick Ass, Dark Roast",
			price: 20000,
			quantity: 4,
			store: "Java Junction",
		},
	]);

	const updateQuantity = (id: number, newQuantity: number): void => {
		setCartItems(
			cartItems.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item))
		);
	};

	return { cartItems, updateQuantity };
};
