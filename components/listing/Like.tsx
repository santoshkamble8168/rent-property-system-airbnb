"use client";

import { User } from "@prisma/client";
import React from "react";
import useLike from "@/hooks/useLike";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

type LikeProps = {
	id: string;
	currentUser: User | null | undefined;
};

const Like: React.FC<LikeProps> = ({ id: likeid, currentUser }) => {
	const { hasLiked, toggleLike } = useLike({
		likeid,
		currentUser,
	});

	return (
		<div
			onClick={toggleLike}
			className="
				relative
				hover:opacity-80
				transition
				cursor-pointer
      "
		>
			<AiOutlineHeart
				size={28}
				className="
				fill-white
				absolute  
				-top-[2px]
				-right-[2px]
        "
			/>
			<AiFillHeart size={24} className={hasLiked ? "fill-rose-500" : "fill-neutral-500/70"} />
		</div>
	);
};

export default Like;
