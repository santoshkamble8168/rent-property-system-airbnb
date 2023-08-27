import { Nunito } from "next/font/google";
import RegisterModal from "@/components/common/modals/RegisterModal";
import ToasterProvider from "@/providers/ToasterProvider";
import Navbar from "@/components/navbar/Navbar";
import LoginModal from "@/components/common/modals/LoginModal";
import getCurrentUser from "./actions/getCurrentUser";
import RentModal from "@/components/common/modals/RentModal";
import "./globals.css";
import SearchModal from "@/components/common/modals/SearchModal";

export const metadata = {
	title: "Airbnb",
	description: "Airbnb App",
};

const font = Nunito({
	subsets: ["latin"],
});

export const dynamic = 'force-dynamic'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const currentUser = await getCurrentUser();

	return (
		<html lang="en">
			<body className={font.className}>
				<RegisterModal />
				<LoginModal />
				<RentModal />
				<SearchModal />
				<ToasterProvider />
				<Navbar currentUser={currentUser} />
				<div className="pb-20 pt-28">{children}</div>
			</body>
		</html>
	);
}
