"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/services/axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Modal from "./Modal";
import useRentModal from "@/hooks/useRentModal";
import Heading from "../Heading";
import Input from "../Input";
import Button from "../Button";
import { categories } from "@/data/categories";
import CategoryInput from "../CategoryInput";
import CountrySelect from "../CountrySelect";
import dynamic from "next/dynamic";
import Counter from "../Counter";
import ImageUpload from "../ImageUpload";
import { initScriptLoader } from "next/script";

type RentModalProps = {};

enum STEPS {
	CATEGORY = 0,
	LOCATION = 1,
	INFO = 2,
	IMAGES = 3,
	DESCRIPTION = 4,
	PRICE = 5,
}

const RentModal: React.FC<RentModalProps> = () => {
	const router = useRouter();

	const RentModal = useRentModal();
	const [isLoading, setIsLoading] = useState(false);
	const [step, setstep] = useState(STEPS.CATEGORY);

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		setValue,
		reset,
	} = useForm<FieldValues>({
		defaultValues: {
			category: "",
			location: null,
			guestCount: 1,
			roomCount: 1,
			bathroomCount: 1,
			imageSrc: "",
			price: 1,
			title: "",
			description: "",
		},
	});

	const category = watch("category");
	const location = watch("location");
	const guestCount = watch("guestCount");
	const roomCount = watch("roomCount");
	const bathroomCount = watch("bathroomCount");
	const imageSrc = watch("imageSrc");

	const LocationMap = useMemo(
		() =>
			dynamic(() => import("../LocationMap"), {
				ssr: false,
			}),
		[location]
	);

	const setCustomValue = (id: string, value: any) => {
		setValue(id, value, {
			shouldValidate: true,
			shouldDirty: true,
			shouldTouch: true,
		});
	};

	const onBack = () => {
		setstep((prev) => prev - 1);
	};

	const onNext = () => {
		setstep((prev) => prev + 1);
	};

	const actionLabel = useMemo(() => {
		if (step === STEPS.PRICE) {
			return "Create";
		}

		return "Next";
	}, [step]);

	const secondaryActionLabel = useMemo(() => {
		if (step === STEPS.CATEGORY) {
			return undefined;
		}

		return "Back";
	}, [step]);

	const onSubmit: SubmitHandler<FieldValues> = async (data) => {
		try {
			if (step !== STEPS.PRICE) {
				return onNext();
			}

			setIsLoading(true);
			const response = await axios.post("/listings", data);
			if (response.status === 200) {
				toast.success("New property created!");
				router.refresh();
				reset();
				setstep(STEPS.CATEGORY);
				RentModal.onClose();
			} else {
				toast.error("Someting went wrong, Please try again");
			}

			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			toast.error("Someting went wrong, Please try again");
		}
	};

	let bodyContent = (
		<div className="flex flex-col gap-8">
			<Heading title="Which of these best describes your place?" subtitle="Pick a category" />
			<div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
				{categories.map((item) => (
					<div key={item.label} className="col-span-1">
						<CategoryInput
							onClick={(value) => setCustomValue("category", value)}
							selected={category === item.label}
							label={item.label}
							icon={item.icon}
						/>
					</div>
				))}
			</div>
		</div>
	);

	if (step === STEPS.LOCATION) {
		bodyContent = (
			<div className="flex flex-col gap-8">
				<Heading title="Where is your place located?" subtitle="Help guests find you!" />
				<CountrySelect value={location} onChange={(value) => setCustomValue("location", value)} />
				<LocationMap center={location?.latlng} />
			</div>
		);
	}

	if (step === STEPS.INFO) {
		bodyContent = (
			<div className="flex flex-col gap-8">
				<Heading title="Share some basic about your place" subtitle="What amenities do you have?" />
				<Counter
					title="Guests"
					subTitle="How many guests do you allow?"
					value={guestCount}
					onChange={(value) => setCustomValue("guestCount", value)}
				/>
				<hr />
				<Counter
					title="Rooms"
					subTitle="How many rooms do you have?"
					value={roomCount}
					onChange={(value) => setCustomValue("roomCount", value)}
				/>
				<hr />
				<Counter
					title="Bathrooms"
					subTitle="How many bathrooms do you have?"
					value={bathroomCount}
					onChange={(value) => setCustomValue("bathroomCount", value)}
				/>
			</div>
		);
	}

	if (step === STEPS.IMAGES) {
		bodyContent = (
			<div className="flex flex-col gap-8">
				<Heading title="Add a photo of your place" subtitle="Show guests what your place look like!" />
				<ImageUpload value={imageSrc} onChange={(value) => setCustomValue("imageSrc", value)} />
			</div>
		);
	}

	if (step === STEPS.DESCRIPTION) {
		bodyContent = (
			<div className="flex flex-col gap-8">
				<Heading title="How would you describe your place?" subtitle="Short and sweet works best!" />
				<Input id="title" label="Title" disabled={isLoading} register={register} errors={errors} required />
				<hr />
				<Input id="description" label="Description" disabled={isLoading} register={register} errors={errors} required />
			</div>
		);
	}

	if (step === STEPS.PRICE) {
		bodyContent = (
			<div className="flex flex-col gap-8">
				<Heading title="Now, set your price" subtitle="how much do you charge per night?" />
				<Input id="price" label="Price" formatPrice type="number" disabled={isLoading} register={register} errors={errors} required />
			</div>
		);
	}

	return (
		<Modal
			disabled={isLoading}
			isOpen={RentModal.isOpen}
			title="Airbnb your home"
			actionLable={actionLabel}
			secondaryActionLabel={secondaryActionLabel}
			secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
			onClose={RentModal.onClose}
			onSubmit={handleSubmit(onSubmit)}
			body={bodyContent}
		/>
	);
};

export default RentModal;
