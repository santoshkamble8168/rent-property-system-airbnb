import prisma from "@/libs/prismaDb";

export interface IlistingParams {
	userId?: string;
	guestCount?: number;
	roomCount?: number;
	bathroomCount?: number;
	startDate?: string;
	endDate?: string;
	locationValue?: string;
	category?: string;
}

export default async function getListings(params: IlistingParams) {
	try {
		const { userId, guestCount, roomCount, bathroomCount, startDate, endDate, locationValue, category } = params;

		let query: any = {};

		if (userId) query.userId = userId;
		if (category) query.category = category;
		if (locationValue) query.locationValue = locationValue;

		if (roomCount)
			query.roomCount = {
				gte: +roomCount,
			};
		if (guestCount)
			query.guestCount = {
				gte: +guestCount,
			};
		if (bathroomCount)
			query.bathroomCount = {
				gte: +bathroomCount,
			};
		if (startDate && endDate)
			query.NOT = {
				reservations: {
					some: {
						OR: [
							{ endDate: { gte: startDate }, startDate: { lte: startDate } },
							{ startDate: { lte: endDate }, endDate: { gte: endDate } },
						],
					},
				},
			};

		const listings = await prisma.listing.findMany({
			where: query,
			orderBy: {
				createdAt: "desc",
			},
		});

		return listings;
	} catch (error: any) {
		throw new Error(error);
	}
}
