import { NextRequest, NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/libs/prismaDb";

interface Iparams {
	likeid?: string;
}

export async function POST(request: NextRequest, { params }: { params: Iparams }) {
	const currentUser = await getCurrentUser();

	if (!currentUser) return NextResponse.error();

	const { likeid } = params;

	if (!likeid || typeof likeid !== "string") {
		throw new Error("Invalid Id");
	}

	let likedIds = [...(currentUser.favoriteIds || [])];

	likedIds.push(likeid);

	const user = await prisma.user.update({
		where: {
			id: currentUser.id,
		},
		data: {
			favoriteIds: likedIds,
		},
	});

	return NextResponse.json(user);
}

export async function DELETE(request: NextRequest, { params }: { params: Iparams }) {
	const currentUser = await getCurrentUser();

	if (!currentUser) return NextResponse.error();

	const { likeid } = params;

	if (!likeid || typeof likeid !== "string") {
		throw new Error("Invalid Id");
	}

	let likedIds = [...(currentUser.favoriteIds || [])];

	likedIds = likedIds.filter((id) => id !== likeid);

	const user = await prisma.user.update({
		where: {
			id: currentUser.id,
		},
		data: {
			favoriteIds: likedIds,
		},
	});

	return NextResponse.json(user);
}
