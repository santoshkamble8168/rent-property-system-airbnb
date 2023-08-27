"use client";

import useCountries from "@/hooks/useCountries";
import { User } from "@prisma/client";
import React from "react";
import Heading from "../common/Heading";
import Image from "next/image";
import Like from "./Like";

type ListingHeadingProps = {
	title: string;
	imageSrc: string;
	locationValue: string;
	id: string;
	currentUser: User | null | undefined;
};

const defaultImageSrc = "/images/placeholder-listing.jpeg";

const ListingHeading: React.FC<ListingHeadingProps> = ({ title, imageSrc, locationValue, id, currentUser }) => {
	const { getByValue } = useCountries();
	const location = getByValue(locationValue);

	return (
		<>
			<Heading title={title} subtitle={`${location?.region}, ${location?.label}`} />
			<div className="w-full h-[60vh] overflow-hidden rounded-xl relative">
				<Image fill alt={title} src={imageSrc || defaultImageSrc} className="object-cover w-full" />
				<div className="absolute top-5 right-5">
					<Like id={id} currentUser={currentUser} />
				</div>
			</div>
		</>
	);
};

export default ListingHeading;
