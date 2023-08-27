"use client";

import useCountries from "@/hooks/useCountries";
import { User } from "@prisma/client";
import React from "react";
import { IconType } from "react-icons";
import Avatar from "../avatar/Avatar";
import ListingCategory from "./ListingCategory";
import dynamic from "next/dynamic";

type ListingInfoProps = {
	user: User;
	category:
		| {
				icon: IconType;
				label: string;
				description: string;
		  }
		| undefined;
	description: string;
	roomCount: number;
	guestCount: number;
	bathroomCount: number;
	locationValue: string;
};

const LocationMap = dynamic(() => import("../common/LocationMap"), {
	ssr: false,
});

const ListingInfo: React.FC<ListingInfoProps> = ({ user, category, description, roomCount, guestCount, bathroomCount, locationValue }) => {
	const { getByValue } = useCountries();
	const coordinates = getByValue(locationValue)?.latlng;

	return (
		<div className="col-span-4 flex flex-col gap-8">
			<div className="flex flex-col gap-2">
				<div className="text-xl font-semibold flex flex-row justify-between items-center gap-2">
					<div className="text-neutral-500">
						Hosted by <span className="capitalize text-neutral-700">{user?.name}</span>
					</div>
					<Avatar src={user?.image} />
				</div>
				<div className="flex flex-row items-center gap-4 font-light text-neutral-500">
					<div className="border-b">{guestCount} guests</div>
					<div className="border-b">{roomCount} rooms</div>
					<div className="border-b">{bathroomCount} bathrooms</div>
				</div>
			</div>
			<hr />
			{category && <ListingCategory icon={category.icon} label={category.label} description={category.description} />}
			<hr />
			<div className="text-lg font-light text-neutral-500">{description}</div>
			<hr />
			<LocationMap center={coordinates} />
		</div>
	);
};

export default ListingInfo;
