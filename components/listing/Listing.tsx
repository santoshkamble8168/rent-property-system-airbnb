"use client";

import { Listing, Reservation, User } from "@prisma/client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Range } from "react-date-range";
import { useRouter } from "next/navigation";
import { categories } from "@/data/categories";
import Container from "../common/Container";
import ListingHeading from "./ListingHeading";
import ListingInfo from "./ListingInfo";
import useLoginModal from "@/hooks/useLoginModal";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import axios from "@/services/axios";
import { toast } from "react-hot-toast";
import ListingReservation from "./ListingReservation";

type ListingProps = {
	listing: Listing & {
		user: User;
	};
	currentUser?: User | null | undefined;
	reservations?: Reservation[];
};

const initialDateRange = {
	startDate: new Date(),
	endDate: new Date(),
	key: "selection",
};

const Listing: React.FC<ListingProps> = ({ listing, currentUser, reservations = [] }) => {
	const loginModal = useLoginModal();
	const router = useRouter();

	const [isLoading, setIsLoading] = useState(false);
	const [totalPrice, setTotalPrice] = useState(listing.price);
	const [dateRange, setDateRange] = useState<Range>(initialDateRange);

	const onCreateReservation = useCallback(async () => {
		try {
			if (!currentUser) return loginModal.onOpen();

			setIsLoading(true);

			const response = await axios.post("reservations", {
				totalPrice,
				startDate: dateRange.startDate,
				endDate: dateRange.endDate,
				listingId: listing.id,
			});

			if (response.status === 200) {
				toast.success("Reservation created!");
				setDateRange(initialDateRange);
				router.push("/trips");
			} else {
				toast.error("Something went wrong!");
			}
		} catch (error) {
			toast.error("Something went wrong!");
		} finally {
			setIsLoading(false);
		}
	}, [totalPrice, dateRange, listing?.id, router, currentUser, loginModal]);

	const disabledDate = useMemo(() => {
		let dates: Date[] = [];

		reservations.forEach((reservation) => {
			const range = eachDayOfInterval({
				start: new Date(reservation.startDate),
				end: new Date(reservation.endDate),
			});

			dates = [...dates, ...range];
		});

		return dates;
	}, [reservations]);

	const category = useMemo(() => {
		return categories.find((item) => item.label === listing.category);
	}, [listing.category]);

	useEffect(() => {
		if (dateRange.startDate && dateRange.endDate) {
			const dayCount = differenceInCalendarDays(dateRange.endDate, dateRange.startDate);

			if (dayCount && listing.price) {
				const calculatedPrice = dayCount * listing.price;
				setTotalPrice(calculatedPrice);
			} else {
				setTotalPrice(listing.price);
			}
		}
	}, [dateRange, listing.price]);

	return (
		<Container>
			<div className="max-w-screen-lg mx-auto">
				<div className="flex flex-col gap-6">
					<ListingHeading
						title={listing.title}
						imageSrc={listing.imageSrc}
						locationValue={listing.locationValue}
						id={listing.id}
						currentUser={currentUser}
					/>

					<div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
						<ListingInfo
							user={listing.user}
							category={category}
							description={listing.description}
							roomCount={listing.roomCount}
							guestCount={listing.guestCount}
							bathroomCount={listing.bathroomCount}
							locationValue={listing.locationValue}
						/>
						<div className="order-first mb-10 md:order-last md:col-span-3">
							<ListingReservation
								price={listing.price}
								totalPrice={totalPrice}
								dateRange={dateRange}
								onChangeDate={(value) => setDateRange(value)}
								onSubmit={onCreateReservation}
								disabled={isLoading}
								disabledDate={disabledDate}
							/>
						</div>
					</div>
				</div>
			</div>
		</Container>
	);
};

export default Listing;
