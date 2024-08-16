import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ArrowDownRight, ArrowUpRight, ChevronRight, MoveUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
	return (
		<div>
			<section className="bg-[#f7f6f2]">
				<div className="grid grid-cols-1 md:grid-cols-2">
					<div className="flex flex-col text-center md:text-left justify-center p-5 py-10 lg:py-20 lg:px-20">
						<h1 className="text-4xl lg:text-6xl mb-4">Our Biggest Event of the Season</h1>
						<p className="text-lg font-semibold mb-6">Kick off Summer with 10% off sitewide.*</p>

						<Link href={"/products"}>
							<Button size={"lg"} className="h-12">
								Shop collection
								<ChevronRight className="ml-2 h-4 w-4" />
							</Button>
						</Link>
					</div>
					<div className="w-full hidden md:block">
						<Image
							src="https://themesflat.co/html/ecomus/images/slider/kitchen-wear-1.jpg"
							alt="Tableware"
							width={700}
							height={700}
						/>
					</div>
				</div>
			</section>

			<section className="grid md:grid-cols-4 bg-white py-20 px-4 md:px-6 gap-4">
				<div className="relative md:col-span-3">
					<Carousel opts={{ align: "start" }} className="h-full">
						<CarouselContent>
							{Array.from({ length: 10 }).map((_, index) => (
								<CarouselItem key={index} className="lg:basis-1/3 basis-1/2 relative ">
									<div className="relative rounded-xl overflow-hidden">
										<Image
											className="aspect-auto w-full object-cover rounded-xl overflow-hidden transform transition-transform duration-500 ease-in-out hover:scale-105"
											src="https://themesflat.co/html/ecomus/images/collections/kitchen-wear-5.jpg"
											width={200}
											height={400}
											alt="product image"
										/>
										<div className="absolute bottom-4 md:bottom-8 left-0 md:left-4 group">
											<Link href={"/products?category=cookwear"}>
												<Badge className="text-black hover:bg-black hover:text-white rounded-sm bg-white px-2 md:px-4 text-sm py-2 md:py-3">
													Cookwear
													<ArrowDownRight className="hidden w-4 h-4 group-hover:block -rotate-90 ml-2" />
												</Badge>
											</Link>
										</div>
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious className="absolute top-[-30px] ring-1 ring-black disabled:ring-gray-500 right-10 md:left-0 z-10" />
						<CarouselNext className="absolute top-[-30px] ring-1 ring-black disabled:ring-gray-500 right-0 md:left-10 z-10" />
						<span className="absolute top-[-42px] left-0 md:left-[90px] z-10 font-bold">
							SHOP BY CATEGORIES
						</span>
					</Carousel>
				</div>
				<div className="flex items-center">
					<Card className="border border-black h-full w-full md:p-10 p-2 flex items-center md:items-start justify-between flex-row md:justify-end md:flex-col">
						<h3 className="text-xl md:text-3xl">Discovery all new items</h3>
						<div className="group md:mt-5">
							<Link href={"/products"}>
								<Button
									size={"icon"}
									className="rounded-full border border-black h-8 md:h-12 w-8 md:w-12 bg-white group-hover:bg-black"
								>
									<ArrowUpRight className="text-black group-hover:text-white" />
								</Button>
							</Link>
						</div>
					</Card>
				</div>
			</section>
		</div>
	);
}
