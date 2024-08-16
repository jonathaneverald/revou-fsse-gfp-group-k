import { cn } from "@/lib/utils";
import React from "react";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className={cn("min-h-screen bg-background font-sans antialiased bg-gray-100")}>
			<Header />

			<main>{children}</main>

			<Footer />
		</div>
	);
};

export default Layout;
