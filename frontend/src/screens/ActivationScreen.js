import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

const ActivationScreen = () => {
	return (
		<div className="py-72">
			<h1 className="text-4xl text-center">
				Your account has been activated, now you can log in!
			</h1>
			<Button className="text-xl button-primary my-10" href="/login">Go to login page</Button>
		</div>
	);
};

export default ActivationScreen;
