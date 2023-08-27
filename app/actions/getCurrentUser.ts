import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/libs/prismaDb";

export async function getSession() {
	return await getServerSession(authOptions);
}

export default async function getCurrentUser() {
	try {
		const session = await getSession();

		//check session exist
		if (!session?.user?.email) {
			return null;
		}

		//find user in DB
		const user = await prisma.user.findUnique({
			where: {
				email: session.user.email as string,
			},
		});

		//if user not exist
		if (!user) {
			return null;
		}

		//if found user -> removed password
		//const { password, ...currentUser } = user;

		return user;
	} catch (error) {
		return null;
	}
}
