import Link from "next/link";
import { useRouter } from "next/router";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

export function DynamicBreadcrumb() {
	const router = useRouter();

	const pathWithoutQuery = router.asPath.split("?")[0];
	const pathSegments = pathWithoutQuery.split("/").filter((segment) => segment);

	return (
		<Breadcrumb className="my-50 py-5">
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink>
						<Link href="/">Home</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>
				{pathSegments.map((segment, index) => {
					const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
					const isLast = index === pathSegments.length - 1;

					return (
						<React.Fragment key={segment}>
							<BreadcrumbSeparator />
							<BreadcrumbItem className="capitalize">
								{isLast ? (
									<BreadcrumbPage>{segment}</BreadcrumbPage>
								) : (
									<BreadcrumbLink>
										<Link className="text-primary" href={href}>
											{segment}
										</Link>
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
						</React.Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
