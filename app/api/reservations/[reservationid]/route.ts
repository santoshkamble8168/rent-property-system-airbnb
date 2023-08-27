import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prismaDb";

import getCurrentUser from "@/app/actions/getCurrentUser";

interface Iparams {
	reservationid?: string;
}

export async function DELETE(request: NextRequest, { params }: { params: Iparams }) {
	const currentUser = await getCurrentUser();

	if (!currentUser) return NextResponse.error();

	const { reservationid } = params;

	if (!reservationid || typeof reservationid !== "string") throw new Error("Invalid reservation Id");

	const reservation = await prisma.reservation.deleteMany({
		where: {
			id: reservationid,
			OR: [{ userId: currentUser.id }, { listing: { userId: currentUser.id } }],
		},
	});

	return NextResponse.json(reservation);
}
