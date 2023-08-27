"use client";

import React, { useCallback, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import Avatar from "../avatar/Avatar";
import MenuItem from "./MenuItem";
import useRegisterModal from "@/hooks/useRegisterModal";
import useLoginModal from "@/hooks/useLoginModal";
import { User } from "@prisma/client";
import { signOut } from "next-auth/react";
import useRentModal from "@/hooks/useRentModal";
import { useRouter } from "next/navigation";

type UserMenuProps = {
	currentUser?: User | null;
};

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
	const RegisterModal = useRegisterModal();
	const LoginModal = useLoginModal();
	const RentModal = useRentModal();
	const router = useRouter();

	const [open, setOpen] = useState(false);

	const toggle = useCallback(() => setOpen((prev) => !prev), []);

	const handleOpenSignUp = () => {
		RegisterModal.onOpen();
		toggle();
	};

	const handleOpenLogin = () => {
		LoginModal.onOpen();
		toggle();
	};

	const onRent = useCallback(() => {
		if (!currentUser) {
			return LoginModal.onOpen();
		}

		RentModal.onOpen();
	}, [LoginModal]);

	return (
		<div className="relative">
			<div className="flex flex-row items-center gap-3">
				<div onClick={onRent} className="hidden md:block text-sm py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer">
					Airbnb your home
				</div>
				<div
					className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
					onClick={toggle}
				>
					<AiOutlineMenu />
					<div className="hidden md:block">
						<Avatar src={currentUser?.image} />
					</div>
				</div>
			</div>
			{open && (
				<div className="absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm">
					<div className="flex flex-col cursor-pointer">
						{currentUser ? (
							<>
								<MenuItem
									onClick={() => {
										router.push("/trips");
										toggle();
									}}
									label="My trips"
								/>
								<MenuItem
									onClick={() => {
										router.push("/favorites");
										toggle();
									}}
									label="My favorites"
								/>
								<MenuItem
									onClick={() => {
										router.push("/reservations");
										toggle();
									}}
									label="My reservations"
								/>
								<MenuItem
									onClick={() => {
										router.push("/properties");
										toggle();
									}}
									label="My properties"
								/>
								<MenuItem
									onClick={() => {
										RentModal.onOpen();
										toggle();
									}}
									label="Airbnb my home"
								/>
								<hr />
								<MenuItem
									onClick={() => {
										signOut();
										toggle();
										router.push("/");
									}}
									label="Logout"
								/>
							</>
						) : (
							<>
								<MenuItem onClick={handleOpenLogin} label="Login" />
								<MenuItem onClick={handleOpenSignUp} label="Sign up" />
							</>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default UserMenu;
