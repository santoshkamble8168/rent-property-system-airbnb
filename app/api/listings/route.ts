import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prismaDb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: NextRequest) {
	const currentUser = await getCurrentUser();

	if (!currentUser) {
		return NextResponse.error();
	}

	const body = await request.json();
	const { category, location, guestCount, roomCount, bathroomCount, imageSrc, price, title, description } = body;

	const newProperty = await prisma.listing.create({
		data: {
			category,
			locationValue: location.value,
			guestCount,
			roomCount,
			bathroomCount,
			imageSrc,
			price: parseInt(price, 10),
			title,
			description,
			userId: currentUser.id,
		},
	});

	return NextResponse.json(newProperty);
}
