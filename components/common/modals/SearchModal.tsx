"use client";

import useSearchModal from "@/hooks/useSearchModal";
import React, { useCallback, useMemo, useState } from "react";
import Modal from "./Modal";
import { useRouter, useSearchParams } from "next/navigation";
import { Range } from "react-date-range";
import qs from "query-string";
import dynamic from "next/dynamic";
import CountrySelect, { CountrySelectValue } from "../CountrySelect";
import { formatISO } from "date-fns";
import Heading from "../Heading";
import Calendar from "../Calendar";
import Counter from "../Counter";

type SearchModalProps = {};

enum STEPS {
	LOCATION = 0,
	DATE = 1,
	INFO = 2,
}

const SearchModal: React.FC<SearchModalProps> = ({}) => {
	const searchModal = useSearchModal();
	const router = useRouter();
	const params = useSearchParams();

	const [step, setStep] = useState(STEPS.LOCATION);
	const [guestCount, setGuestCount] = useState(1);
	const [roomCount, setRoomCount] = useState(1);
	const [bathroomCount, setBathroomCount] = useState(1);
	const [dateRange, setdateRange] = useState<Range>({
		startDate: new Date(),
		endDate: new Date(),
		key: "selection",
	});
	const [location, setLocation] = useState<CountrySelectValue>();

	const LocationMap = useMemo(
		() =>
			dynamic(() => import("../LocationMap"), {
				ssr: false,
			}),
		[location]
	);

	const onBack = useCallback(() => {
		setStep((prev) => prev - 1);
	}, []);

	const onNext = useCallback(() => {
		setStep((prev) => prev + 1);
	}, []);

	const onSubmit = useCallback(async () => {
		if (step !== STEPS.INFO) return onNext();

		let currentQuery = {};

		if (params) {
			currentQuery = qs.parse(params.toString());
		}

		const updatedQuery: any = {
			...currentQuery,
			locationValue: location?.value,
			guestCount,
			roomCount,
			bathroomCount,
		};

		if (dateRange.startDate) {
			updatedQuery.startDate = formatISO(dateRange.startDate);
		}

		if (dateRange.endDate) {
			updatedQuery.endDate = formatISO(dateRange.endDate);
		}

		const url = qs.stringifyUrl(
			{
				url: "/",
				query: updatedQuery,
			},
			{ skipNull: true }
		);

		setStep(STEPS.LOCATION);
		searchModal.onClose();
		router.push(url);
		//reset other local states if we want
	}, [step, searchModal, location, router, guestCount, roomCount, bathroomCount, dateRange, onNext, params]);

	const actionLabel = useMemo(() => {
		if (step === STEPS.INFO) return "Search";

		return "Next";
	}, [step]);

	const secondaryActionLabel = useMemo(() => {
		if (step === STEPS.LOCATION) return undefined;

		return "Back";
	}, [step]);

	let bodyContent = (
		<div className="flex flex-col gap-8">
			<Heading title="Where do you wanna go?" subtitle="Find the perfect location" />
			<CountrySelect value={location} onChange={(value) => setLocation(value as CountrySelectValue)} />
			<hr />
			<LocationMap center={location?.latlng} />
		</div>
	);

	if (step === STEPS.DATE) {
		bodyContent = (
			<div className="flex flex-col gap-8">
				<Heading title="When do you plan to go?" subtitle="Make sure everyone is free!" />
				<Calendar value={dateRange} onChange={(value) => setdateRange(value.selection)} />
			</div>
		);
	}

	if (step === STEPS.INFO) {
		bodyContent = (
			<div className="flex flex-col gap-8">
				<Heading title="More information" subtitle="Find your perfect place!" />
				<Counter title="Guests" subTitle="How many guests are coming?" value={guestCount} onChange={(value) => setGuestCount(value)} />
				<Counter title="Rooms" subTitle="How many rooms you want?" value={roomCount} onChange={(value) => setRoomCount(value)} />
				<Counter
					title="Bathrooms"
					subTitle="How many bathrooms you need?"
					value={bathroomCount}
					onChange={(value) => setBathroomCount(value)}
				/>
			</div>
		);
	}

	return (
		<Modal
			isOpen={searchModal.isOpen}
			onClose={searchModal.onClose}
			onSubmit={onSubmit}
			title="Filters"
			actionLable={actionLabel}
			secondaryActionLabel={secondaryActionLabel}
			body={bodyContent}
			secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
		/>
	);
};

export default SearchModal;
