"use client";

import React from "react";
import Container from "../common/Container";
import { categories } from "@/data/categories";
import CategoryBox from "./CategoryBox";
import { usePathname, useSearchParams } from "next/navigation";
import { icons } from "react-icons";

type CategoriesProps = {};

const Categories: React.FC<CategoriesProps> = ({}) => {
	const params = useSearchParams();
	const category = params?.get("category");
	const pathName = usePathname();

	const isMainPage = pathName === "/";

	if (!isMainPage) {
		return null;
	}

	return (
		<Container>
			<div className="pt-4 flex justify-center items-center flex-row overflow-x-auto">
				{categories.map((item) => (
					<CategoryBox
						key={item.label}
						label={item.label}
						desription={item.description}
						icon={item.icon}
						selected={category === item.label}
					/>
				))}
			</div>
		</Container>
	);
};

export default Categories;
