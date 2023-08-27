import React from "react";
import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingbyId";
import EmptyState from "@/components/common/EmptyState";
import Listing from "@/components/listing/Listing";
import type { Metadata, ResolvingMetadata } from "next";
import getReservations from "@/app/actions/getReservations";

interface IParams {
	listingId?: string;
}

// export async function generateMetadata({ params }: { params: IParams }, parent?: ResolvingMetadata): Promise<Metadata> {
// 	const listing = await getListingById(params);

// 	return {
// 		title: `${listing?.title} | Airbnb`,
// 		description: listing?.description,
// 	};
// }

const ListingPage = async ({ params }: { params: IParams }) => {
	const listing = await getListingById(params);
	const reservations = await getReservations(params);
	const currentUser = await getCurrentUser();

	if (!listing) {
		return <EmptyState title="No listing found with the Id" subTitle="Click the buton below to go back" showReset />;
	}

	return <Listing listing={listing} reservations={reservations} currentUser={currentUser} />;
};

export default ListingPage;
