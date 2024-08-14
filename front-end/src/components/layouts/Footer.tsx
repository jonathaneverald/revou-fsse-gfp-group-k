import React from "react";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import Image from "next/image";

const Footer = () => {
	return (
		<Card className="w-full z-50 rounded-none border-t">
			<CardContent className="p-8">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div>
						<Image
							className="mb-5"
							alt="brand logo"
							src={
								"https://pickbazar-react-rest.vercel.app/_next/image?url=https%3A%2F%2Fpickbazarlaravel.s3.ap-southeast-1.amazonaws.com%2F2295%2FLogo-new.png&w=2048&q=75"
							}
							width={200}
							height={50}
						/>
						<p className="text-sm mb-2">NY State Thruway, New York, USA</p>
						<p className="text-sm mb-2">demo@demo.com</p>
						<p className="text-sm mb-5">+129290122122</p>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-4">Explore</h3>
						<ul className="space-y-2">
							<li className="text-sm">
								<a href="#">Shops</a>
							</li>
							<li className="text-sm">
								<a href="#">Authors</a>
							</li>
							<li className="text-sm">
								<a href="#">Flash Deals</a>
							</li>
							<li className="text-sm">
								<a href="#">Coupon</a>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-4">Customer Service</h3>
						<ul className="space-y-2">
							<li className="text-sm">
								<a href="#">FAQ & Helps</a>
							</li>
							<li className="text-sm">
								<a href="#">Vendor Refund Policies</a>
							</li>
							<li className="text-sm">
								<a href="#">Customer Refund Policies</a>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-4">Our Information</h3>
						<ul className="space-y-2">
							<li className="text-sm">
								<a href="#">Manufacturers</a>
							</li>
							<li className="text-sm">
								<a href="#">Privacy policies</a>
							</li>
							<li className="text-sm">
								<a href="#">Terms & conditions</a>
							</li>
							<li className="text-sm">
								<a href="#">Contact Us</a>
							</li>
						</ul>
					</div>
				</div>

				<Separator className="my-8" />

				<div className="text-center text-sm text-gray-500">
					©2024 Pickbazar. Copyright © REDQ. All rights reserved worldwide. REDQ
				</div>
			</CardContent>
		</Card>
	);
};

export default Footer;
