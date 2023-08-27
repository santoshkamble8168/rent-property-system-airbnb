"use client";

import React, { useCallback, useState } from "react";
import axios from "axios";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import useRegisterModal from "@/hooks/useRegisterModal";
import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../Input";
import { toast } from "react-hot-toast";
import Button from "../Button";
import { signIn } from "next-auth/react";
import useLoginModal from "@/hooks/useLoginModal";

type RegisterModalProps = {};

const RegisterModal: React.FC<RegisterModalProps> = () => {
	const RegisterModal = useRegisterModal();
	const LoginModal = useLoginModal();
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FieldValues>({
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	const onSubmit: SubmitHandler<FieldValues> = (data) => {
		setIsLoading(true);
		axios
			.post("/api/register", data)
			.then((data) => {
				LoginModal.onOpen();
				RegisterModal.onClose();
				toast.success(data?.data?.message || "User created successfully");
			})
			.catch((errors) => {
				toast.error("Something went wrong!");
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const toggle = useCallback(() => {
		RegisterModal.onClose();
		LoginModal.onOpen();
	}, [LoginModal, RegisterModal]);

	const bodyContent = (
		<div className="flex flex-col gap-4">
			<Heading title="Welcome to Airbnb" subtitle="Create an account" />
			<Input id="name" label="Name" disabled={isLoading} register={register} errors={errors} required />
			<Input id="email" label="Email" disabled={isLoading} register={register} errors={errors} required />
			<Input id="password" label="Password" type="password" disabled={isLoading} register={register} errors={errors} required />
		</div>
	);

	const footerContent = (
		<div className="flex flex-col gap-4 mt-3">
			<hr />
			<Button outline label="Continue with Google" icon={FcGoogle} onClick={() => signIn("google")} />
			<Button outline label="Continue with Github" icon={AiFillGithub} onClick={() => signIn("github")} />
			<div className="text-neutral-500  mt-4 font-light">
				<div className="flex flex-row items-center justify-center gap-2 ">
					<div>Already have an account?</div>
					<div onClick={toggle} className="text-neutral-800 cursor-pointer hover:underline">
						Log in
					</div>
				</div>
			</div>
		</div>
	);

	return (
		<Modal
			disabled={isLoading}
			isOpen={RegisterModal.isOpen}
			title="Register"
			actionLable="Continue"
			onClose={RegisterModal.onClose}
			onSubmit={handleSubmit(onSubmit)}
			body={bodyContent}
			footer={footerContent}
		/>
	);
};

export default RegisterModal;
