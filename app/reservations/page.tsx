import React from "react";
import EmptyState from "@/components/common/EmptyState";

import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";
import AllReservations from "@/components/reservations/AllReservations";

type ReservationsProps = {};

const Reservations = async ({}) => {
	const currentUser = await getCurrentUser();

	if (!currentUser) {
		return <EmptyState title="Unauthorised!" subTitle="Please login" />;
	}

	const reservations = await getReservations({ authorId: currentUser.id });

	if (reservations.length === 0) {
		return <EmptyState title="No reservations found!" subTitle="Look like you haven no reservations on your properties." />;
	}

	return <AllReservations reservations={reservations} currentUser={currentUser} />;
};

export default Reservations;
