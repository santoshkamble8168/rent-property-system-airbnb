import React from "react";
import EmptyState from "@/components/common/EmptyState";

import getCurrentUser from "../actions/getCurrentUser";
import MyTrips from "@/components/trips/MyTrips";
import getListings from "../actions/getListings";
import MyProperties from "@/components/properties/MyProperties";

type PropertiesProps = {};

const Properties = async ({}) => {
	const currentUser = await getCurrentUser();

	if (!currentUser) {
		return <EmptyState title="Unauthorised!" subTitle="Please login" />;
	}

	const listings = await getListings({ userId: currentUser.id });

	if (listings.length === 0) {
		return <EmptyState title="No properties found!" subTitle="Look like you have no properties." />;
	}

	return <MyProperties listings={listings} currentUser={currentUser} />;
};

export default Properties;
