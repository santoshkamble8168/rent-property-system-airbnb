"use client";

import EmptyState from "@/components/common/EmptyState";
import React, { useEffect } from "react";

type ErrorProps = {
	error: Error;
};

const Error: React.FC<ErrorProps> = ({ error }) => {
	useEffect(() => {
		console.log("error", error);
	}, [error]);

	return <EmptyState title="Uh oh" subTitle="Something went wrong!" />;
};

export default Error;
