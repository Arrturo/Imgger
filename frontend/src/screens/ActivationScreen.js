import React, { useState, useEffect, useProps } from "react";
import FormContainer from "../components/FormContainer";
import { Form, Button, Row, Col, FormGroup } from "react-bootstrap";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { url } from "../constants/host";

const ActivationScreen = () => {
	const { token } = useParams();

	const navigate = useNavigate();

	const [message, setMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	useEffect(() => {
		const config = {
			headers: {
				"Content-type": "application/json",
			},
		};

		const verifyAccount = async () => {
			const { data } = await axios.post(
				`${url}/graphql`,
				{
					query: `
			   mutation {
				verifyAccount(token: "${token}"){
				  success
				  errors
				}
			  }
			  `,
				},
				config
			);

			console.log(data);

			if (data?.data?.verifyAccount?.success) {
				setSuccessMessage(
					"Your account has been activated, now you can log in!"
				);
				setTimeout(() => {
					navigate("/login");
				}, 3000);
			} else {
				setMessage(
					data?.data?.verifyAccount?.errors?.nonFieldErrors[0]?.message
				);
			}
		};

		verifyAccount();
	}, [token]);

	return (
		<div className="py-72">
			<h1 className="text-4xl text-center">
				{successMessage}
				{message}
			</h1>
		</div>
	);
};

export default ActivationScreen;
