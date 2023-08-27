import React, { useCallback, useMemo } from "react";
import axios from "@/services/axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { User } from "@prisma/client";

import useLoginModal from "./useLoginModal";

interface IUseLike {
	likeid: string;
	currentUser?: User | null | undefined;
}

const useLike = ({ likeid, currentUser }: IUseLike) => {
	const router = useRouter();
	const loginModal = useLoginModal();

	const hasLiked = useMemo(() => {
		const list = currentUser?.favoriteIds || [];

		return list.includes(likeid);
	}, [currentUser, likeid]);

	const toggleLike = useCallback(
		async (e: React.MouseEvent<HTMLDivElement>) => {
			try {
				e.stopPropagation();

				if (!currentUser) return loginModal.onOpen();

				let request;
				if (hasLiked) {
					request = () => axios.delete(`/liked/${likeid}`);
				} else {
					request = () => axios.post(`/liked/${likeid}`);
				}

				await request();

				router.refresh();
				toast.success(hasLiked ? "Remove from favorites" : "Added into favorites");
			} catch (error) {
				toast.error("something went wrong!");
			}
		},
		[currentUser, hasLiked, likeid, loginModal, router]
	);

	return {
		hasLiked,
		toggleLike,
	};
};

export default useLike;
