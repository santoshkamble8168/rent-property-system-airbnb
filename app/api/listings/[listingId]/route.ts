import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prismaDb";

import getCurrentUser from "@/app/actions/getCurrentUser";

interface Iparams {
	listingId?: string;
}

export async function DELETE(request: NextRequest, { params }: { params: Iparams }) {
	const currentUser = await getCurrentUser();

	if (!currentUser) return NextResponse.error();

	const { listingId } = params;

	if (!listingId || typeof listingId !== "string") throw new Error("Invalid reservation Id");

	const listing = await prisma.listing.deleteMany({
		where: {
			id: listingId,
			userId: currentUser.id,
		},
	});

	return NextResponse.json(listing);
}
