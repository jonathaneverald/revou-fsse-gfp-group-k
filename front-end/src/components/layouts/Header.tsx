import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Search, ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import ProfileDropdown from "../menu/ProfileDropdown";
import SearchForm from "../form/SearchForm";

const Header: React.FC = () => {
	return (
		<header className="sticky z-30 top-0 flex h-24 items-center gap-4 border-b bg-background px-4 md:px-6 shadow-sm">
			<nav className="hidden flex-col gap-6 text-lg font-medium sm:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
				<Link href={"/"}>
					<Image
						alt="brand logo"
						src={
							"https://pickbazar-react-rest.vercel.app/_next/image?url=https%3A%2F%2Fpickbazarlaravel.s3.ap-southeast-1.amazonaws.com%2F2295%2FLogo-new.png&w=2048&q=75"
						}
						width={200}
						height={50}
					/>
				</Link>
			</nav>

			<div className="flex w-full items-center gap-2 md:ml-auto ">
				<SearchForm />
				<Link href={"/carts"}>
					<Button variant="outline" size="icon" className="rounded-full">
						<ShoppingCart className="h-4 w-4" />
					</Button>
				</Link>
				<ProfileDropdown />
			</div>
		</header>
	);
};

export default Header;
