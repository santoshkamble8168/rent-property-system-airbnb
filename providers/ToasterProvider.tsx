"use client";

import React from "react";
import { Toaster } from "react-hot-toast";

type ToasterProviderProps = {};

const ToasterProvider: React.FC<ToasterProviderProps> = () => {
	return <Toaster />;
};

export default ToasterProvider;
