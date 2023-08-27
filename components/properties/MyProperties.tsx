"use client";

import { Listing, User } from "@prisma/client";
import React, { useCallback, useState } from "react";
import Container from "../common/Container";
import Heading from "../common/Heading";
import { useRouter } from "next/navigation";
import axios from "@/services/axios";
import { toast } from "react-hot-toast";
import ListingCard from "../listing/ListingCard";

type MyPropertiesProps = {
	listings: Listing[];
	currentUser: User;
};

const MyProperties: React.FC<MyPropertiesProps> = ({ listings, currentUser }) => {
	const router = useRouter();

	const [deleteId, setDeleteId] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const onCancel = useCallback(
		async (id: string) => {
			try {
				setDeleteId(id);

				const response = await axios.delete(`/listings/${id}`);
				if (response.status === 200) {
					toast.success("Property deleted!");
					router.refresh();
				} else {
					toast.error("Something went wrong!");
				}
			} catch (error) {
				toast.error("Something went wrong!");
			} finally {
				setDeleteId("");
			}
		},
		[router]
	);

	return (
		<Container>
			<Heading title="Properties" subtitle="List of your properties" />
			<div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
				{listings.map((listing) => (
					<ListingCard
						key={listing.id}
						data={listing}
						actionId={listing.id}
						onAction={onCancel}
						disabled={deleteId === listing.id}
						actionLabel="Delete property"
						currentUser={currentUser}
					/>
				))}
			</div>
		</Container>
	);
};

export default MyProperties;
