"use client";

import React, { useCallback, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import useLoginModal from "@/hooks/useLoginModal";
import useRegisterModal from "@/hooks/useRegisterModal";
import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../Input";
import { toast } from "react-hot-toast";
import Button from "../Button";

type LoginModalProps = {};

const LoginModal: React.FC<LoginModalProps> = () => {
	const router = useRouter();
	const params = useSearchParams();
	const RegisterModal = useRegisterModal();
	const LoginModal = useLoginModal();

	const loginCallback: any = params?.get("callbackUrl");

	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FieldValues>({
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit: SubmitHandler<FieldValues> = (data) => {
		setIsLoading(true);
		signIn("credentials", {
			...data,
			redirect: false,
		})
			.then((data) => {
				if (data?.error) {
					return toast.error(data.error);
				}

				toast.success("Logged in");
				if (loginCallback) {
					let url = loginCallback.split("/").pop();
					router.push(url ? `/${url}` : "/");
				}
				router.refresh();
				LoginModal.onClose();
			})
			.catch((error) => {
				toast.error("Something went wrong!");
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const toggle = useCallback(() => {
		LoginModal.onClose();
		RegisterModal.onOpen();
	}, [LoginModal, RegisterModal]);

	const bodyContent = (
		<div className="flex flex-col gap-4">
			<Heading title="Welcome back to Airbnb" subtitle="login to your account" />
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
					<div>First time using Airbnb?</div>
					<div onClick={toggle} className="text-neutral-800 cursor-pointer hover:underline">
						Create an account
					</div>
				</div>
			</div>
		</div>
	);

	return (
		<Modal
			disabled={isLoading}
			isOpen={LoginModal.isOpen}
			title="Login"
			actionLable="Continue"
			onClose={LoginModal.onClose}
			onSubmit={handleSubmit(onSubmit)}
			body={bodyContent}
			footer={footerContent}
		/>
	);
};

export default LoginModal;
