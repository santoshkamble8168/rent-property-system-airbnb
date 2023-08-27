import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/libs/prismaDb";

export async function POST(request: NextRequest) {
	const body = await request.json();
	const { name, email, password } = body;
	//check email is already exists

	const hashedPassword: any = await bcrypt.hash(password, 12);

	const user = await prisma.user.create({
		data: {
			name,
			email,
			hashedPassword,
		},
	});

	//let { hashedPassword, ...data } = user;

	return NextResponse.json({
		message: "User registration success!",
		status: true,
		item: user,
	});
}
