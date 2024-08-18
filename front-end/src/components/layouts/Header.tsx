import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ShoppingCart, Store } from "lucide-react";
import { Button } from "../ui/button";
import ProfileDropdown from "../menu/ProfileDropdown";
import SearchForm from "../form/SearchForm";
import StoreNav from "../menu/StoreNav";

const Header: React.FC = () => {
	return (
		<header className="sticky z-50 top-0 flex h-24 items-center gap-4 border-b bg-background px-4 md:px-6 shadow-sm">
			<nav className="hidden flex-col gap-6 text-lg font-medium sm:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
				<Link href={"/"}>
					<Image
						alt="brand logo"
						src={"https://themesflat.co/html/ecomus/images/logo/logo.svg"}
						width={200}
						height={50}
					/>
				</Link>
			</nav>

			<div className="flex w-full items-center gap-2 md:ml-auto ">
				<SearchForm />
				<Link href={"/carts"}>
					<Button variant="outline" size="icon">
						<ShoppingCart className="h-4 w-4" />
					</Button>
				</Link>

				<StoreNav />

				<ProfileDropdown />
			</div>
		</header>
	);
};

export default Header;
