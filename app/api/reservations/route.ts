import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prismaDb";

import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: NextRequest) {
	const currentUser = await getCurrentUser();

	if (!currentUser) return NextResponse.error();

	const body = await request.json();

	const { listingId, totalPrice, startDate, endDate } = body;

	if (!listingId || !totalPrice || !startDate || !endDate) return NextResponse.error();
	const newReservation = await prisma.listing.update({
		where: {
			id: listingId,
		},
		data: {
			reservations: {
				create: {
					userId: currentUser.id,
					startDate,
					endDate,
					totalPrice,
				},
			},
		},
	});

	return NextResponse.json(newReservation);
}
