"use client";

import React, { useCallback, useMemo } from "react";
import { Listing, User, Reservation } from "@prisma/client";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import useCountries from "@/hooks/useCountries";
import Image from "next/image";
import Like from "./Like";
import Button from "../common/Button";

type ListingCardProps = {
	data: Listing;
	currentUser?: User | null | undefined;
	reservation?: Reservation;
	onAction?: (id: string) => void;
	actionLabel?: string;
	actionId?: string;
	disabled?: boolean;
};

const defaultImageSrc = "/images/placeholder-listing.jpeg";

const ListingCard: React.FC<ListingCardProps> = ({ data, currentUser, reservation, onAction, actionLabel, actionId = "", disabled }) => {
	const router = useRouter();
	const { getByValue } = useCountries();

	const location = getByValue(data.locationValue);

	const price = useMemo(() => {
		if (reservation) return reservation.totalPrice;

		return data.price;
	}, [reservation, data.price]);

	const reservationDate = useMemo(() => {
		if (!reservation) return null;

		const start = new Date(reservation.startDate);
		const end = new Date(reservation.endDate);

		return `${format(start, "PP")} - ${format(end, "PP")}`;
	}, [reservation]);

	const handleCancel = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			e.stopPropagation();

			if (disabled) return;

			onAction?.(actionId);
		},
		[onAction, actionId, disabled]
	);

	return (
		<div onClick={() => router.push(`/listings/${data.id}`)} className="col-span-1 cursor-pointer group">
			<div className="flex flex-col gap-2 w-full">
				<div className="aspect-square w-full relative overflow-hidden rounded-xl">
					<Image
						fill
						alt={data.title}
						src={data.imageSrc || defaultImageSrc}
						className="object-cover h-full w-full group-hover:scale-110 transition"
					/>

					<div className="absolute top-3 right-3">
						<Like id={data.id} currentUser={currentUser} />
					</div>
				</div>
				<div className="font-semibold text-lg">
					<span className="text-neutral-500">{location?.region}</span>, <span className="text-neutral-800">{location?.label}</span>
				</div>
				<div className="font-light text-neutral-500">{reservationDate || data.category}</div>
				<div className="flex flex-row items-center gap-1">
					<div className="font-semibold">${price}</div>
					{!reservation && <div className="font-light">night</div>}
				</div>

				{onAction && actionLabel && <Button disabled={disabled} small onClick={handleCancel} label={actionLabel} />}
			</div>
		</div>
	);
};

export default ListingCard;
