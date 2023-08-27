import React from "react";
import EmptyState from "@/components/common/EmptyState";

import getCurrentUser from "../actions/getCurrentUser";
import getFavorites from "../actions/getFavorites";
import MyFavorites from "@/components/favorites/MyFavorites";

type FavoritesProps = {};

const Favorites = async ({}) => {
	const currentUser = await getCurrentUser();
	const favorites = await getFavorites();

	if (!currentUser) {
		return <EmptyState title="Unauthorised!" subTitle="Please login" />;
	}

	if (favorites.length === 0) {
		return <EmptyState title="No favorites found!" subTitle="Look like you haven no favorites listing" />;
	}

	return <MyFavorites listings={favorites} currentUser={currentUser} />;
};

export default Favorites;
