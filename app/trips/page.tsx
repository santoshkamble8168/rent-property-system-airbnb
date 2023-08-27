import React from "react";
import EmptyState from "@/components/common/EmptyState";

import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";
import MyTrips from "@/components/trips/MyTrips";

type TripsProps = {};

const Trips = async ({}) => {
	const currentUser = await getCurrentUser();

	if (!currentUser) {
		return <EmptyState title="Unauthorised!" subTitle="Please login" />;
	}

	const reservations = await getReservations({ userId: currentUser.id });

	if (reservations.length === 0) {
		return <EmptyState title="No trips found!" subTitle="Look like you havent reserved any trips." />;
	}

	return <MyTrips reservations={reservations} currentUser={currentUser} />;
};

export default Trips;
