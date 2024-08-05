import React, { useState } from "react";
import { useRouter } from "next/router";
import { Input } from "../ui/input";
import { useFetchCities } from "@/hooks/useFetchCities";
import { useFilteredCategories } from "@/hooks/useFilteredCategories";
import { useFilteredCities } from "@/hooks/useFilteredCities";
import Categories from "../sidebar/Categories";
import Cities from "../sidebar/Cities";

const productCategories = [
	"Electronics",
	"Home Appliances",
	"Furniture",
	"Clothing",
	"Beauty and Personal Care",
	"Health and Wellness",
	"Books",
	"Toys",
	"Sports Equipment",
	"Automotive",
	"Gardening",
	"Pet Supplies",
	"Groceries",
	"Office Supplies",
	"Music Instruments",
	"Movies and TV",
	"Video Games",
	"Jewelry",
	"Watches",
	"Bags and Luggage",
	"Outdoor Gear",
	"Kitchenware",
	"Cleaning Supplies",
	"Baby Products",
	"Tools and Hardware",
	"Art Supplies",
	"Craft Supplies",
	"Building Materials",
	"Stationery",
	"Lighting",
];

const citiesInIndonesia = [
	"Jakarta",
	"Surabaya",
	"Bandung",
	"Medan",
	"Bekasi",
	"Depok",
	"Tangerang",
	"Makassar",
	"Semarang",
	"Palembang",
	"South Tangerang",
	"Batam",
	"Pekanbaru",
	"Bogor",
	"Denpasar",
	"Malang",
	"Padang",
	"Samarinda",
	"Tasikmalaya",
	"Banjarmasin",
];

const Sidebar: React.FC = () => {
	return (
		<div className="border w-full md:block hidden my-5 h-fit rounded-md bg-white py-6 px-3 overflow-y-auto">
			<Categories />
			<Cities />
		</div>
	);
};

export default Sidebar;
