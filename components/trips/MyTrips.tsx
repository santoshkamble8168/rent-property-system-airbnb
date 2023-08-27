"use client";

import { Listing, Reservation, User } from "@prisma/client";
import React, { useCallback, useState } from "react";
import Container from "../common/Container";
import Heading from "../common/Heading";
import { useRouter } from "next/navigation";
import axios from "@/services/axios";
import { toast } from "react-hot-toast";
import ListingCard from "../listing/ListingCard";

export type SafeReservation = Reservation & {
	listing: Listing;
};

type MyTripsProps = {
	reservations: SafeReservation[];
	currentUser: User;
};

const MyTrips: React.FC<MyTripsProps> = ({ reservations, currentUser }) => {
	const router = useRouter();

	const [deleteId, setDeleteId] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const onCancel = useCallback(
		async (id: string) => {
			try {
				setDeleteId(id);

				const response = await axios.delete(`/reservations/${id}`);
				if (response.status === 200) {
					toast.success("Reservation cancelled!");
					router.refresh();
				} else {
					toast.error("Something went wrong!");
				}
			} catch (error) {
				toast.error("Something went wrong!");
			} finally {
				setDeleteId("");
			}
		},
		[router]
	);

	return (
		<Container>
			<Heading title="Trips" subtitle="Where you've been and where you-re going" />
			<div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
				{reservations.map((reservation) => (
					<ListingCard
						key={reservation.id}
						data={reservation.listing}
						reservation={reservation}
						actionId={reservation.id}
						onAction={onCancel}
						disabled={deleteId === reservation.id}
						actionLabel="Cancel reservation"
						currentUser={currentUser}
					/>
				))}
			</div>
		</Container>
	);
};

export default MyTrips;
