"use client";

import React from "react";
import Image from "next/image";

type AvatarProps = {
	src?: string | null | undefined;
};

const Avatar: React.FC<AvatarProps> = ({ src }) => {
	return <Image alt="avatar" className="rounded-full" height="30" width="30" src={src || "/images/avatar.jpg"} />;
};

export default Avatar;
